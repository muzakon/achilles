// import type { HttpContext } from '@adonisjs/core/http'
import {
	imageGenerationTaskStatusValidator,
	imageGenerationTaskValidator,
} from "#validators/image_generation_task";
import { HttpContext } from "@adonisjs/core/http";
import { inject } from "@adonisjs/core";
import { ImageGenerationTaskService } from "#services/prisma/image_generation_task_service";
import { Logger } from "@adonisjs/core/logger";
import { Validator } from "../lib/validator.js";

@inject()
export default class ImageGenerationTasksController {
	constructor(
		private imageGenerationTaskService: ImageGenerationTaskService,
		protected logger: Logger,
	) {}

	async create({ request, userId }: HttpContext): Promise<unknown> {
		const payload = await Validator.validateRequest(
			request,
			imageGenerationTaskValidator,
		);
		return await this.imageGenerationTaskService.create(userId, payload);
	}

	async status({ request, userId }: HttpContext): Promise<unknown> {
		const payload = await Validator.validateRequest(
			request,
			imageGenerationTaskStatusValidator,
		);
		return await this.imageGenerationTaskService.getTaskStatus(userId, payload);
	}
}
