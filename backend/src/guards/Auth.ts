import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TokenPayload } from "src/modules/user/user.interfaces";
import { SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
	private readonly logger = new Logger(JwtService.name);
	constructor(
		private jwtService: JwtService,
		private configService: ConfigService,
		private reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			// 💡 See this condition
			return true;
		}

		const JWT_SECRET: string | undefined = this.configService.get("JWT_SECRET");
		if (JWT_SECRET === undefined) {
			this.logger.fatal("Can not read JWT SECRET.");

			// Here we could send message to a notification channel, however, its a hobby project so i don't mind it.
			throw new UnauthorizedException();
		}

		const request: Request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const payload: TokenPayload = await this.jwtService.verifyAsync(token, {
				secret: JWT_SECRET,
			});
			// 💡 We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			request["user"] = payload;
		} catch (error: unknown) {
			console.log(error);
			throw new UnauthorizedException();
		}

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}
}

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
