import { GeneratedImageType, ImageGenerationTask, PrismaClient } from '@prisma/client'
import { PrismaService } from '../utils/prisma_service.js'
import {
  ImageGenerationTaskCreate,
  ImageGenerationTaskStatus,
} from '#validators/image_generation_task'
import { Fal } from '../../lib/fal.js'
import { StatusCodes } from 'http-status-codes'
import { Exception } from '@adonisjs/core/exceptions'
import { FalImage, ProcessedImageTaskResponse, TaskStatus } from '../../interfaces/fal.interface.js'
import { ulid } from 'ulidx'
import dayjs from 'dayjs'
import { GoogleCloudStorageService } from '#services/utils/storage'
import env from '#start/env'
import config from '@adonisjs/core/services/config'
import logger from '@adonisjs/core/services/logger'
import Paginator from '#services/utils/paginator'

/**
 * Service class for managing image generation tasks.
 * Handles creation, status updates, and retrieval of image generation tasks.
 */
export class ImageGenerationTaskService {
  private storage: GoogleCloudStorageService

  /**
   * Initializes the service with Prisma and Fal instances.
   * Also sets up Google Cloud Storage for image uploads.
   */
  constructor(
    private prisma: PrismaClient = PrismaService.getInstance(),
    private fal: Fal = new Fal()
  ) {
    this.storage = new GoogleCloudStorageService(
      env.get('GCS_BUCKET_NAME'),
      config.get('app.serviceAccount'),
      true
    )
  }

  /**
   * Fetches all image generation tasks for a specific user.
   * @param userId - The ID of the user.
   * @returns A list of image generation tasks.
   */
  async fetchAllTasks(userId: string): Promise<ImageGenerationTask[]> {
    return this.prisma.imageGenerationTask.findMany({
      where: { owner: userId },
    })
  }

  /**
   * Creates a new image generation task.
   * @param userId - The ID of the user creating the task.
   * @param payload - The payload containing task details (prompt, model, etc.).
   * @returns The created image generation task.
   * @throws Exception if image generation initiation fails.
   */
  async create(userId: string, payload: ImageGenerationTaskCreate): Promise<ImageGenerationTask> {
    const response = await this.fal.generateImage(payload)
    if (!response) {
      throw new Exception('Failed to initiate image generation', {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      })
    }

    return this.prisma.imageGenerationTask.create({
      data: {
        owner: userId,
        prompt: payload.prompt,
        model: payload.model,
        requestId: response.request_id,
        imageSize: payload.imageSize,
        seed: payload.seed,
        status: response.status,
        generatedImages: [],
        createdAt: dayjs().unix(),
      },
    })
  }

  /**
   * Retrieves the status of a specific image generation task.
   * @param userId - The ID of the user.
   * @param payload - The payload containing the task ID.
   * @returns The updated image generation task.
   * @throws Exception if the task is not found.
   */
  async getTaskStatus(
    userId: string,
    payload: ImageGenerationTaskStatus
  ): Promise<ImageGenerationTask> {
    const task = await this.prisma.imageGenerationTask.findFirst({
      where: { owner: userId, id: payload.task_id },
    })

    if (!task) {
      throw new Exception(`Task not found with ID: ${payload.task_id}.`, {
        status: StatusCodes.NOT_FOUND,
      })
    }

    // If the task is already completed or errored, return it as is.
    if (task.status !== TaskStatus.IN_QUEUE) {
      return task
    }

    // Check the status of the task with Fal.
    const statusResponse = await this.fal.checkStatus(task.requestId, task.model)

    // Handle completed tasks.
    if (statusResponse.status === TaskStatus.COMPLETED) {
      const taskResponse = await this.fal.fetchResult(task.requestId, task.model)
      return await this.updateTask(
        task.id,
        TaskStatus.COMPLETED,
        await this.createGeneratedImages(userId, taskResponse)
      )
    }

    // Handle errored tasks.
    if (statusResponse.status === TaskStatus.ERROR) {
      return await this.updateTask(task.id, TaskStatus.ERROR)
    }

    // Return the task if it's still in progress.
    return task
  }

  /**
   * Retrieves paginated image generation tasks for a specific user.
   * @param userId - The ID of the user.
   * @param page - The page number for pagination.
   * @param limit - The number of tasks per page.
   * @returns Paginated response containing tasks, total count, and pagination details.
   */
  async getAll(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: ImageGenerationTask[]
    total: number
    nextPage: string | null
    prevPage: string | null
  }> {
    const skip = (page - 1) * limit

    // Fetch total count and paginated data in parallel.
    const [total, data] = await Promise.all([
      this.prisma.imageGenerationTask.count({
        where: { owner: userId },
      }),
      this.prisma.imageGenerationTask.findMany({
        where: { owner: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ])

    // Process images to add signed URLs.
    const processedData = await this.processGeneratedImages(data, userId)

    return Paginator.paginate(processedData, total, page, limit)
  }

  /**
   * Processes generated images to add signed URLs for each image.
   * @param tasks - The list of image generation tasks.
   * @param userId - The ID of the user.
   * @returns A list of tasks with signed URLs for generated images.
   */
  private async processGeneratedImages(
    tasks: ImageGenerationTask[],
    userId: string
  ): Promise<ImageGenerationTask[]> {
    return Promise.all(
      tasks.map(async (task) => {
        const signedUrls = await Promise.all(
          task.generatedImages.map((gi) =>
            this.storage.createSignedUrl(`generations/${userId}/${gi.id}.jpeg`)
          )
        )
        return {
          ...task,
          generatedImages: task.generatedImages.map((gi, index) => ({
            ...gi,
            signedUrl: signedUrls[index],
          })),
        }
      })
    )
  }

  /**
   * Creates generated images and uploads them to Google Cloud Storage.
   * @param userId - The ID of the user.
   * @param response - The response from Fal containing generated images.
   * @returns A list of generated images with metadata.
   */
  private async createGeneratedImages(
    userId: string,
    response: ProcessedImageTaskResponse
  ): Promise<GeneratedImageType[]> {
    return Promise.all(
      response.images.map(async (image) => {
        const imageId = ulid().toString()
        const blobUrl = await this.uploadImagesToBlob(userId, image, imageId)

        return {
          width: image.width,
          height: image.height,
          originalUrl: image.url,
          blobUrl,
          meta: {
            removedBackgroundUrl: null,
            upscaledUrl: null,
          },
          id: imageId,
        }
      })
    )
  }

  /**
   * Updates the status and generated images of a task.
   * @param taskId - The ID of the task to update.
   * @param status - The new status of the task.
   * @param generatedImages - Optional list of generated images to update.
   * @returns The updated image generation task.
   */
  private async updateTask(
    taskId: string,
    status: TaskStatus,
    generatedImages?: GeneratedImageType[]
  ): Promise<ImageGenerationTask> {
    return this.prisma.imageGenerationTask.update({
      where: { id: taskId },
      data: {
        status,
        ...(generatedImages && { generatedImages }),
      },
    })
  }

  /**
   * Uploads an image to Google Cloud Storage.
   * @param userId - The ID of the user.
   * @param image - The image to upload.
   * @param imageId - The ID of the image.
   * @returns The destination path of the uploaded image.
   * @throws Exception if the image URL is missing.
   */
  private async uploadImagesToBlob(
    userId: string,
    image: FalImage,
    imageId: string
  ): Promise<string> {
    const destinationPath = `generations/${userId}/${imageId}.jpeg`

    if (!image.url) {
      logger.info(`Image: ${imageId} has no Fal URL. So, it is not possible to upload into GCS.`)
      throw new Exception('An unknown error occurred. Try again later.', {
        status: StatusCodes.BAD_REQUEST,
      })
    }

    await this.storage.uploadImageFromUrl(image.url, destinationPath)
    return destinationPath
  }
}
