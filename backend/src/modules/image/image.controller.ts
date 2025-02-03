import { Controller, Post, Body, Get } from "@nestjs/common";
import { ImageService } from "./image.service";
import { GenerateImageDto, FalRequestStatusDto } from "./image.dto";

@Controller("image")
export class ImageController {
	constructor(private readonly imageService: ImageService) {}

	@Post("/generate")
	generate(@Body() data: GenerateImageDto) {
		return this.imageService.generate(data);
	}

	@Get("/status")
	status(@Body() data: FalRequestStatusDto) {
		return this.imageService.getRequestStatus(data);
	}

	@Get("/result")
	result(@Body() data: FalRequestStatusDto) {
		return this.imageService.getRequestResult(data);
	}
}
