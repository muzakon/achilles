import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { CreateUserDto, LoginUserDto } from "./user.dto";
import { AuthResponse } from "./user.interfaces";
import { JwtService } from "@nestjs/jwt";
import * as dayjs from "dayjs";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
	protected saltRounds = 10;

	constructor(
		@InjectModel(User.name) private userModel: Model<User>,
		private jwtService: JwtService,
	) {}

	async findUser(email: string): Promise<UserDocument | null> {
		return await this.userModel.findOne({ email: email });
	}

	async create(data: CreateUserDto): Promise<UserDocument> {
		let newUser = new this.userModel({
			...data,
			createdAt: dayjs().unix(),
		});
		return await newUser.save();
	}

	async hashPassword(psw: string): Promise<string> {
		return await bcrypt.hash(psw, this.saltRounds);
	}

	async verifyPassword(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}

	async register(data: CreateUserDto): Promise<AuthResponse> {
		let user = await this.findUser(data.email);
		if (user) {
			throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
		}

		if (data.password !== data.passwordConfirm) {
			throw new HttpException(
				"Passwords do not match.",
				HttpStatus.BAD_REQUEST,
			);
		}

		const hashedPassword = await this.hashPassword(data.password);

		user = await this.create({
			...data,
			password: hashedPassword,
		});

		const payload = { sub: user._id, username: user.email };
		const accessTokenExpiresIn = 5 * 60000; // 5 minutes
		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: accessTokenExpiresIn,
		});
		const refreshToken = await this.jwtService.signAsync(payload);

		return {
			accessToken,
			refreshToken,
			accessTokenExpiresIn: dayjs().unix() + accessTokenExpiresIn,
			refreshTokenExpiresIn: null,
			tokenType: "Bearer",
		};
	}

	async login(data: LoginUserDto): Promise<AuthResponse> {
		const user = await this.findUser(data.email);
		if (!user) {
			throw new HttpException(
				"User not found or password does not match.",
				HttpStatus.BAD_REQUEST,
			);
		}

		const isPasswordValid = await this.verifyPassword(
			data.password,
			user.password,
		);

		if (!isPasswordValid) {
			throw new HttpException(
				"User not found or password does not match.",
				HttpStatus.BAD_REQUEST,
			);
		}

		const payload = { sub: user._id, username: user.email };
		const accessTokenExpiresIn = 5 * 60000; // 5 minutes
		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: accessTokenExpiresIn,
		});
		const refreshToken = await this.jwtService.signAsync(payload);

		return {
			accessToken,
			refreshToken,
			accessTokenExpiresIn: dayjs().unix() + accessTokenExpiresIn,
			refreshTokenExpiresIn: null,
			tokenType: "Bearer",
		};
	}
}
