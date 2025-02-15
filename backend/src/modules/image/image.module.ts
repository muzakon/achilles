import { Module } from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageController } from "./image.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageGenerationTask, ImageGenerationTaskSchema } from "./image.schema";
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: ImageGenerationTask.name, schema: ImageGenerationTaskSchema },
		]),
	],
	controllers: [ImageController],
	providers: [ImageService],
})
export class ImageModule {}
