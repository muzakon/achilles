import { Injectable } from "@nestjs/common";
import { GenerateImageDto, FalRequestStatusDto } from "./image.dto";
import { Image, ImageDocument } from "./image.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { FalAiWrapper } from "src/lib/fal_ai";
import { QueueStatus, Result } from "@fal-ai/client";

@Injectable()
export class ImageService {
	protected falAiWrapper: FalAiWrapper = new FalAiWrapper(
		process.env.FAL_AI_API_KEY,
	);

	constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}

	async generate(data: GenerateImageDto): Promise<ImageDocument> {
		const requestId = await this.falAiWrapper.generateImage(data);
		return await this.create(data, requestId);
	}

	async getRequestStatus(data: FalRequestStatusDto): Promise<QueueStatus> {
		return await this.falAiWrapper.getRequestStatus(
			data.requestId,
			data.selectedModel,
		);
	}

	async getRequestResult(data: FalRequestStatusDto): Promise<Result<any>> {
		return await this.falAiWrapper.getRequestResult(
			data.requestId,
			data.selectedModel,
		);
	}

	async create(
		data: GenerateImageDto,
		requestId: string,
	): Promise<ImageDocument> {
		const createdImage = new this.imageModel({
			...data,
			requestId,
			model: data.selectedModel,
			cretedAt: Math.round(+new Date() / 1000),
		});
		return await createdImage.save();
	}
}
