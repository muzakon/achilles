import vine from "@vinejs/vine";
import { Infer } from "@vinejs/vine/types";
import { isValidIdRule } from "./rules/object_id.js";

export const imageGenerationTaskValidator = vine.compile(
	vine.object({
		prompt: vine.string(),
		seed: vine.number(),
		numImages: vine.number().min(1).max(4),
		imageSize: vine.string(),
		model: vine.string(),
	}),
);

export const imageGenerationTaskStatusValidator = vine.compile(
	vine.object({
		task_id: vine.string().use(isValidIdRule(null)),
	}),
);

export type ImageGenerationTaskCreate = Infer<
	typeof imageGenerationTaskValidator
>;
export type ImageGenerationTaskStatus = Infer<
	typeof imageGenerationTaskStatusValidator
>;
