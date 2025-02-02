import { IsNotEmpty } from "class-validator";

export class FalRequestStatusDto {
	@IsNotEmpty()
	selectedModel: string;

	@IsNotEmpty()
	requestId: string;
}
