import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GenerateImageDto, CreationStatusCheckDto } from './image.dto';
import {
  ImageGenerationTask,
  ImageGenerationTaskDocument,
} from './image.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FalAiWrapper } from 'src/lib/fal_ai';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from '../user/user.interfaces';
import { FalModelOutputMap } from './image.interface';
import { GeneratedImages } from './image.schema';
import { Result } from '@fal-ai/client';
import { GoogleCloudStorageService } from '../../lib/cloud_storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  // Initialize FalAiWrapper with the API key from environment variables
  private readonly falAiWrapper: FalAiWrapper = new FalAiWrapper(
    process.env.FAL_AI_API_KEY,
  );
  private readonly logger = new Logger(ImageService.name);

  constructor(
    @InjectModel(ImageGenerationTask.name)
    private readonly imageGenerationTaskModel: Model<ImageGenerationTask>,
    @Inject(REQUEST) private readonly request: UserRequest,
    private configService: ConfigService,
  ) {}

  /**
   * Fetch all image generation tasks for the current user.
   * @returns {Promise<ImageGenerationTask[]>} - List of tasks owned by the user.
   */
  async getAllTasks(): Promise<ImageGenerationTask[]> {
    const tasks = await this.imageGenerationTaskModel
      .find({
        owner: this.request.user.sub,
      })
      .exec();

    return tasks.map((x) => ({
      ...x.toObject({
        virtuals: true,
      }),
    }));
  }

  /**
   * Generate an image using the Fal AI API and save the task details.
   * @param {GenerateImageDto} data - Data required for image generation.
   * @returns {Promise<ImageGenerationTaskDocument>} - The created task document.
   */
  async generateImage(
    data: GenerateImageDto,
  ): Promise<ImageGenerationTaskDocument> {
    const requestId = await this.falAiWrapper.generateImage(data);
    return this.createTask(data, requestId);
  }

  /**
   * Check the status of an image generation task and update it if necessary.
   * @param {CreationStatusCheckDto} data - Data containing the task ID to check.
   * @returns {Promise<ImageGenerationTaskDocument>} - The updated task document.
   * @throws {HttpException} - If the task is not found.
   */
  async checkTaskStatus(
    data: CreationStatusCheckDto,
  ): Promise<ImageGenerationTaskDocument> {
    const task: ImageGenerationTaskDocument | null =
      await this.imageGenerationTaskModel
        .findOne({
          requestId: data.task_id,
          owner: this.request.user.sub,
        })
        .exec();

    if (!task) {
      throw new HttpException('Could not find task.', HttpStatus.NOT_FOUND);
    }

    // If the task is already processed, return it immediately
    if (task.status !== 'PROCESSING') {
      return task;
    }

    // Fetch the latest status from the Fal AI API
    const falStatus = await this.falAiWrapper.getRequestStatus(
      task.requestId,
      task.model.toString() as keyof FalModelOutputMap,
    );

    // If the task is completed, update the task details
    if (falStatus.status === 'COMPLETED') {
      task.status = 'PROCESSED';

      const result = await this.falAiWrapper.getRequestResult(
        task.requestId,
        task.model.toString() as keyof FalModelOutputMap,
      );

      // Map the generated images to the task document
      task.generatedImages = this.createGeneratedImages(result);

      for (let i = 0; i < task.generatedImages.length; i++) {
        const image = task.generatedImages[i];
        const blobUrl = await this.uploadImagesToBlob(image);

        image.blobUrl = blobUrl;
      }

      await task.save();
    }

    return task;
  }

  private createGeneratedImages<Id extends keyof FalModelOutputMap>(
    result: Result<FalModelOutputMap[Id]>,
  ): GeneratedImages[] {
    return result.data.images.map((image) => ({
      width: image.width ?? null,
      height: image.height ?? null,
      originalUrl: image.url ?? null,
      blobUrl: null,
      meta: {
        removedBackgroundUrl: null,
        upscaledUrl: null,
      },
      _id: new mongoose.Types.ObjectId(),
      signedUrl: null,
    }));
  }

  private async uploadImagesToBlob(image: GeneratedImages): Promise<string> {
    const bucketName = this.configService.get<string>('GCS_BUCKET_NAME');
    if (!bucketName) {
      this.logger.error('GCS_BUCKET_NAME not set in environment variables.');
      throw new HttpException(
        'An unknown error occured. Try again later.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const serviceAccountData =
      this.configService.get<object>('SERVICE_ACCOUNT');
    if (!serviceAccountData) {
      this.logger.error('SERVICE_ACCOUNT not set in environment variables.');
      throw new HttpException(
        'An unknown error occured. Try again later.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const storageService = new GoogleCloudStorageService(
      bucketName,
      serviceAccountData,
      true,
    );

    const imageId = image._id.toString();
    const destinationPath = `generations/${this.request.user.sub.toString()}/${imageId}.jpeg`;

    if (!image.originalUrl) {
      this.logger.log(
        `Image: ${imageId} has no Fal URL. So, it is not possible to upload into GCS.`,
      );

      throw new HttpException(
        'An unknown error occured. Try again later.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await storageService.uploadImageFromUrl(image.originalUrl, destinationPath);

    return destinationPath;
  }

  /**
   * Create a new image generation task in the database.
   * @param {GenerateImageDto} data - Data required for image generation.
   * @param {string} requestId - The request ID returned by the Fal AI API.
   * @returns {Promise<ImageGenerationTaskDocument>} - The created task document.
   */
  private async createTask(
    data: GenerateImageDto,
    requestId: string,
  ): Promise<ImageGenerationTaskDocument> {
    const createdTask = new this.imageGenerationTaskModel({
      ...data,
      requestId,
      model: data.selectedModel,
      createdAt: Math.floor(Date.now() / 1000), // Use Math.floor for clarity
      owner: this.request.user.sub,
    });
    return createdTask.save();
  }
}
