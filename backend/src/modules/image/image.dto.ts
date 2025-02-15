import { ImageSize } from "@fal-ai/client/endpoints";
import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class GenerateImageDto {
	@IsNotEmpty()
	selectedModel: string;

	@IsNotEmpty()
	prompt: string;

	@IsNotEmpty()
	@IsInt()
	seed: number;

	@IsNotEmpty()
	imageSize:
		| "landscape_4_3"
		| "portrait_16_9"
		| ImageSize
		| "square_hd"
		| "square"
		| "portrait_4_3"
		| "landscape_16_9"
		| undefined;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(4)
	numImages: number;
}

export class CreationStatusCheckDto {
	@IsNotEmpty()
	task_id: string;
}
