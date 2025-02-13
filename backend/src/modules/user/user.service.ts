import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, LoginUserDto, RefreshAccessTokenDto } from './user.dto';
import { AuthResponse, TokenPayload } from './user.interfaces';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  // Use `readonly` for constants to ensure immutability
  private readonly saltRounds = 10;
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Finds a user by email.
   * @param email - The email of the user to find.
   * @returns The user document or null if not found.
   */
  async findUser(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec(); // Use `.exec()` for better TypeScript support
  }

  /**
   * Creates a new user.
   * @param data - The user data to create.
   * @returns The created user document.
   */
  async create(data: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel({
      ...data,
      createdAt: dayjs().unix(), // Use Unix timestamp for consistency
    });
    return newUser.save();
  }

  /**
   * Hashes a password using bcrypt.
   * @param password - The password to hash.
   * @returns The hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Verifies a password against a hash.
   * @param password - The password to verify.
   * @param hash - The hash to compare against.
   * @returns True if the password matches the hash, otherwise false.
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Registers a new user.
   * @param data - The user registration data.
   * @returns Authentication response with tokens.
   * @throws HttpException if user already exists or passwords do not match.
   */
  async register(data: CreateUserDto): Promise<AuthResponse> {
    const existingUser = await this.findUser(data.email);
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    if (data.password !== data.passwordConfirm) {
      throw new HttpException(
        'Passwords do not match.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashPassword(data.password);
    const user = await this.create({
      ...data,
      password: hashedPassword,
    });

    return this.generateAuthResponse(user);
  }

  /**
   * Logs in a user.
   * @param data - The user login data.
   * @returns Authentication response with tokens.
   * @throws HttpException if user is not found or password is invalid.
   */
  async login(data: LoginUserDto): Promise<AuthResponse> {
    const user = await this.findUser(data.email);
    if (!user) {
      throw new HttpException(
        'User not found or password does not match.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordValid = await this.verifyPassword(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException(
        'User not found or password does not match.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.generateAuthResponse(user);
  }

  /**
   * Refreshes an access token using a refresh token.
   * @param data - The refresh token data.
   * @returns Authentication response with a new access token.
   * @throws HttpException if the refresh token is invalid or user is not found.
   */
  async refresh(data: RefreshAccessTokenDto): Promise<AuthResponse> {
    const JWT_SECRET = this.configService.get<string>('JWT_SECRET');

    let payload: TokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(
        data.refreshToken,
        {
          secret: JWT_SECRET,
        },
      );
    } catch (error) {
      this.logger.error('Failed to verify refresh token', error);
      throw new HttpException('Invalid refresh token.', HttpStatus.BAD_REQUEST);
    }

    const user = await this.findUser(payload.email);
    if (!user) {
      throw new HttpException('User not found.', HttpStatus.BAD_REQUEST);
    }

    return this.generateAuthResponse(user, data.refreshToken);
  }

  /**
   * Generates an authentication response with access and refresh tokens.
   * @param user - The user document.
   * @param refreshToken - Optional existing refresh token to reuse.
   * @returns Authentication response.
   */
  private async generateAuthResponse(
    user: UserDocument,
    refreshToken?: string,
  ): Promise<AuthResponse> {
    const payload: TokenPayload = { sub: user._id, email: user.email };
    const accessTokenExpiresIn = 60; // 1 minute
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: `${accessTokenExpiresIn}s`,
    });

    // Reuse the provided refresh token or generate a new one
    const newRefreshToken =
      refreshToken || (await this.jwtService.signAsync(payload));

    return {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresIn: dayjs().add(accessTokenExpiresIn, 'seconds').unix(),
      refreshTokenExpiresIn: null, // Refresh tokens typically have a longer lifespan
      tokenType: 'Bearer',
    };
  }
}
