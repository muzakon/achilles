import {
	GeneratedImageType,
	ImageGenerationTask,
	PrismaClient,
} from "@prisma/client";
import { PrismaService } from "../utils/prisma_service.js";
import {
	ImageGenerationTaskCreate,
	ImageGenerationTaskStatus,
} from "#validators/image_generation_task";
import { Fal } from "../../lib/fal.js";
import { StatusCodes } from "http-status-codes";
import { Exception } from "@adonisjs/core/exceptions";
import {
	FalImage,
	ProcessedImageTaskResponse,
	TaskStatus,
} from "../../interfaces/fal.interface.js";
import { ulid } from "ulidx";
import dayjs from "dayjs";
import { GoogleCloudStorageService } from "#services/utils/storage";
import env from "#start/env";
import config from "@adonisjs/core/services/config";
import logger from "@adonisjs/core/services/logger";

export class ImageGenerationTaskService {
	private storage: GoogleCloudStorageService;

	constructor(
		private prisma: PrismaClient = PrismaService.getInstance(),
		private fal: Fal = new Fal(),
	) {
		this.storage = new GoogleCloudStorageService(
			env.get("GCS_BUCKET_NAME"),
			config.get("app.serviceAccount"),
			true,
		);
	}

	async fetchAllTasks(userId: string): Promise<ImageGenerationTask[]> {
		return this.prisma.imageGenerationTask.findMany({
			where: { owner: userId },
		});
	}

	async create(
		userId: string,
		payload: ImageGenerationTaskCreate,
	): Promise<ImageGenerationTask> {
		const response = await this.fal.generateImage(payload);
		if (!response) {
			throw new Exception("Failed to initiate image generation", {
				status: StatusCodes.INTERNAL_SERVER_ERROR,
			});
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
		});
	}

	async getTaskStatus(
		userId: string,
		payload: ImageGenerationTaskStatus,
	): Promise<ImageGenerationTask> {
		const task = await this.prisma.imageGenerationTask.findFirst({
			where: { owner: userId, id: payload.task_id },
		});

		if (!task) {
			throw new Exception(`Task not found with ID: ${payload.task_id}.`, {
				status: StatusCodes.NOT_FOUND,
			});
		}

		if (task.status !== TaskStatus.IN_QUEUE) {
			return task;
		}

		const statusResponse = await this.fal.checkStatus(
			task.requestId,
			task.model,
		);

		if (statusResponse.status === TaskStatus.COMPLETED) {
			const taskResponse = await this.fal.fetchResult(
				task.requestId,
				task.model,
			);
			return this.updateTask(
				task.id,
				TaskStatus.COMPLETED,
				await this.createGeneratedImages(userId, taskResponse),
			);
		}

		if (statusResponse.status === TaskStatus.ERROR) {
			return this.updateTask(task.id, TaskStatus.ERROR);
		}

		return task;
	}

	private async createGeneratedImages(
		userId: string,
		response: ProcessedImageTaskResponse,
	): Promise<GeneratedImageType[]> {
		const output = await Promise.all(
			response.images.map(async (image) => {
				const imageId = ulid().toString();
				const blobUrl = await this.uploadImagesToBlob(userId, image, imageId);

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
				};
			}),
		);

		return output;
	}

	private async updateTask(
		taskId: string,
		status: TaskStatus,
		generatedImages?: GeneratedImageType[],
	): Promise<ImageGenerationTask> {
		return this.prisma.imageGenerationTask.update({
			where: { id: taskId },
			data: {
				status,
				...(generatedImages && { generatedImages }),
			},
		});
	}

	private async uploadImagesToBlob(
		userId: string,
		image: FalImage,
		imageId: string,
	): Promise<string> {
		const destinationPath = `generations/${userId}/${imageId}.jpeg`;

		if (!image.url) {
			logger.info(
				`Image: ${imageId} has no Fal URL. So, it is not possible to upload into GCS.`,
			);
			throw new Exception("An unknown error occurred. Try again later.", {
				status: StatusCodes.BAD_REQUEST,
			});
		}

		await this.storage.uploadImageFromUrl(image.url, destinationPath);
		return destinationPath;
	}
}
