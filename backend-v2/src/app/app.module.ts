import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { IndexModule } from "../modules/index.module";

// Mongoose
import { MongooseModule } from "@nestjs/mongoose";

// Config
import { ConfigModule } from "@nestjs/config";

const ENV_FILE =
	process.env.NODE_ENV == "production" ? ".env.production" : ".env.development";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ENV_FILE,
			isGlobal: true,
		}),
		IndexModule,
		MongooseModule.forRoot("mongodb://localhost/27017"),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
