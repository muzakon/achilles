import { ApiError, fal, FalClient, QueueStatus, Result } from "@fal-ai/client";
import { Config } from "@fal-ai/client/src/config";
import { GenerateImageDto } from "../modules/image/image.dto";
import { BadRequestException, HttpException, Logger } from "@nestjs/common";

// Define a type for the singleton FalClient instance
type SingletonFalClient = {
	config(config: Config): void;
} & FalClient;

export class FalAiWrapper {
	// Singleton instance of FalClient
	protected fal: SingletonFalClient;
	// Logger instance for logging errors and information
	private readonly logger = new Logger(FalAiWrapper.name);

	constructor(apiKey: string | undefined) {
		if (!apiKey) {
			throw new BadRequestException(
				"API key is required to initialize FalAiWrapper.",
			);
		}

		// Initialize the FalClient with the provided API key
		this.fal = fal;
		this.fal.config({
			credentials: apiKey,
		});
	}

	/**
	 * Generates an image using the specified model and parameters.
	 * @param data - The DTO containing the image generation parameters.
	 * @returns The request ID for tracking the image generation process.
	 * @throws HttpException or BadRequestException if an error occurs.
	 */
	async generateImage(data: GenerateImageDto): Promise<string> {
		try {
			const { request_id } = await this.fal.queue.submit(data.selectedModel, {
				input: {
					prompt: data.prompt,
					seed: data.seed,
					image_size: data.imageSize,
					num_images: data.numImages,
				},
			});

			return request_id;
		} catch (error: unknown) {
			this.handleError(error, "generate image");
		}
	}

	/**
	 * Retrieves the status of a request using the request ID and model.
	 * @param requestId - The ID of the request to check.
	 * @param selectedModel - The model used for the request.
	 * @returns The status of the request.
	 * @throws HttpException or BadRequestException if an error occurs.
	 */
	async getRequestStatus(
		requestId: string,
		selectedModel: string,
	): Promise<QueueStatus> {
		try {
			const status = await this.fal.queue.status(selectedModel, {
				requestId: requestId,
			});

			return status;
		} catch (error: unknown) {
			this.handleError(error, "get request status");
		}
	}

	/**
	 * Retrieves the result of a request using the request ID and model.
	 * @param requestId - The ID of the request to check.
	 * @param selectedModel - The model used for the request.
	 * @returns The result of the request.
	 * @throws HttpException or BadRequestException if an error occurs.
	 */
	async getRequestResult(
		requestId: string,
		selectedModel: string,
	): Promise<Result<any>> {
		try {
			const result = await this.fal.queue.result(selectedModel, {
				requestId: requestId,
			});

			return result;
		} catch (error: unknown) {
			this.handleError(error, "get request result");
		}
	}

	/**
	 * Handles errors consistently across all methods.
	 * @param error - The error object caught in the try-catch block.
	 * @param context - A string describing the context where the error occurred.
	 * @throws HttpException or BadRequestException based on the error type.
	 */
	private handleError(error: unknown, context: string): never {
		if (error instanceof ApiError) {
			this.logger.error(error, error.stack);
			// throw new HttpException(
			// 	`An error occurred while trying to ${context}.`,
			// 	error.status,
			// );
		} else {
			this.logger.error(`Unexpected error in ${context}: ${error}`);
		}

		throw new BadRequestException(
			`An unexpected error occurred while trying to ${context}.`,
		);
	}
}
