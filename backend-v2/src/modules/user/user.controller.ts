import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, LoginUserDto } from "./user.dto";

@Controller("user")
export class UserController {
	constructor(private userService: UserService) {}

	@Post("/register")
	async registerUser(@Body() data: CreateUserDto) {
		return await this.userService.register(data);
	}

	@Post("/login")
	async loginUser(@Body() data: LoginUserDto) {
		return await this.userService.login(data);
	}
}
