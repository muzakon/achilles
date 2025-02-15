import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { GenerateImageDto, CreationStatusCheckDto } from './image.dto';
import {
  ImageGenerationTask,
  ImageGenerationTaskDocument,
} from './image.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FalAiWrapper } from 'src/lib/fal_ai';
import { REQUEST } from '@nestjs/core';
import { UserRequest } from '../user/user.interfaces';
import { FalModelOutputMap } from './image.interface';
import { GeneratedImages } from './image.schema';
import { Result } from '@fal-ai/client';

@Injectable()
export class ImageService {
  // Initialize FalAiWrapper with the API key from environment variables
  private readonly falAiWrapper: FalAiWrapper = new FalAiWrapper(
    process.env.FAL_AI_API_KEY,
  );

  constructor(
    @InjectModel(ImageGenerationTask.name)
    private readonly imageGenerationTaskModel: Model<ImageGenerationTask>,
    @Inject(REQUEST) private readonly request: UserRequest,
  ) {}

  /**
   * Fetch all image generation tasks for the current user.
   * @returns {Promise<ImageGenerationTaskDocument[]>} - List of tasks owned by the user.
   */
  async getAllTasks(): Promise<ImageGenerationTaskDocument[]> {
    return this.imageGenerationTaskModel
      .find({
        owner: this.request.user.sub,
      })
      .exec(); // Use .exec() for better TypeScript support and consistency
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
    const task = await this.imageGenerationTaskModel
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
    }));
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
