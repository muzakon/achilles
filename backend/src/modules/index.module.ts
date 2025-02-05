import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ImageModule } from "./image/image.module";

@Module({
	imports: [
		UserModule, 
		ImageModule
	],
})
export class IndexModule {}
