import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  passwordConfirm: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  lastName: string;
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class RefreshAccessTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
