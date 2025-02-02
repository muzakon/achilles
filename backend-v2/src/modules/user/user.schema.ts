import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
	@Prop()
	name: string;

	@Prop()
	lastName: string;

	@Prop()
	email: string;

	@Prop()
	password: string;

	@Prop()
	isActive: boolean;

	@Prop()
	createdAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
