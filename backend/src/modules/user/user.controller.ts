import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto, RefreshAccessTokenDto } from './user.dto';
import { Public } from '../../guards/Auth';

@Public()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async registerUser(@Body() data: CreateUserDto) {
    return await this.userService.register(data);
  }

  @Post('/login')
  async loginUser(@Body() data: LoginUserDto) {
    return await this.userService.login(data);
  }

  @Post('/refresh')
  async refreshToken(@Body() data: RefreshAccessTokenDto) {
    return await this.userService.refresh(data);
  }
}
