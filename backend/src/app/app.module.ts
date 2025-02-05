import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { IndexModule } from "../modules/index.module";

// Mongoose
import { MongooseModule } from "@nestjs/mongoose";

// Config
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "../guards/Auth";

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
	providers: [
		AppService,
		ConfigService,
		JwtService,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
