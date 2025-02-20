import { RequestManager } from "./request_manager.js";
import env from "#start/env";
import { ImageGenerationTaskCreate } from "#validators/image_generation_task";
import {
	GenerateImageResponse,
	QueuedImageTaskResponse,
	ProcessedImageTaskResponse,
} from "../interfaces/fal.interface.js";
import { Exception } from "@adonisjs/core/exceptions";
import { StatusCodes } from "http-status-codes";

export class Fal extends RequestManager {
	private readonly BASE_URL: string = "https://queue.fal.run";
	private headers: RequestInit["headers"] = undefined;

	constructor() {
		super();
		this.headers = {
			Authorization: `Key ${env.get("FAL_AI_API_KEY")}`,
		};
	}

	throwBadRequestErro() {
		throw new Exception(
			"An error occured when trying to process your request. Please try again later.",
			{
				status: StatusCodes.BAD_REQUEST,
			},
		);
	}

	async generateImage(data: ImageGenerationTaskCreate) {
		const response = await this.generateRequest<GenerateImageResponse>(
			"POST",
			`${this.BASE_URL}/${data.model}`,
			{
				headers: this.headers,
				throwExceptions: true,
				retry: 3,
				json: data,
			},
		);
		return response;
	}

	async checkStatus(
		requestId: string,
		model: string,
	): Promise<QueuedImageTaskResponse> {
		const response = await this.generateRequest<QueuedImageTaskResponse>(
			"GET",
			`${this.BASE_URL}/${model}/requests/${requestId}/status`,
			{
				headers: this.headers,
				throwExceptions: true,
				retry: 3,
			},
		);

		if (!response) {
			throw new Exception(
				"An error occured when trying to process your request. Please try again later.",
				{
					status: StatusCodes.BAD_REQUEST,
				},
			);
		}

		return response;
	}

	async fetchResult(
		requestId: string,
		model: string,
	): Promise<ProcessedImageTaskResponse> {
		const response = await this.generateRequest<ProcessedImageTaskResponse>(
			"GET",
			`${this.BASE_URL}/${model}/requests/${requestId}`,
			{
				headers: this.headers,
				throwExceptions: true,
				retry: 3,
			},
		);

		if (!response) {
			throw new Exception(
				"An error occured when trying to process your request. Please try again later.",
				{
					status: StatusCodes.BAD_REQUEST,
				},
			);
		}

		return response;
	}
}
