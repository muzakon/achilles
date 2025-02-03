import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
	@Prop()
	prompt: string;

	@Prop()
	model: string;

	@Prop()
	requestId: string;

	@Prop()
	baseUrl: string;

	@Prop()
	imageSize: string;

	@Prop()
	seed: number;

	@Prop()
	cretedAt: number;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
