import { Controller, Post, Body, Get } from "@nestjs/common";
import { ImageService } from "./image.service";
import { GenerateImageDto, CreationStatusCheckDto } from "./image.dto";

@Controller("image")
export class ImageController {
	constructor(private readonly imageService: ImageService) {}

	@Get("/all")
	all() {
		return this.imageService.getAllTasks();
	}

	@Post("/generate")
	generate(@Body() data: GenerateImageDto) {
		return this.imageService.generateImage(data);
	}

	@Get("/status")
	status(@Body() data: CreationStatusCheckDto) {
		return this.imageService.checkTaskStatus(data);
	}
}
