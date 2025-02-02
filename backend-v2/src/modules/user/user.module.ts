import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		JwtModule.registerAsync({
			useFactory: () => ({
				global: true,
				secret: process.env.JWT_SECRET,
			}),
		}),
	],
	providers: [UserService],
	controllers: [UserController],
})
export class UserModule {}
