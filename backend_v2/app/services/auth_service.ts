import * as jose from 'jose'
import hash from '@adonisjs/core/services/hash'
import { AuthResponse, TokenPayload } from '../interfaces/auth.interface.js'
import { PrismaClient, User } from '@prisma/client'
import dayjs from 'dayjs'
import env from '#start/env'
import { PrismaService } from './prisma_service.js'
import { Exception } from '@adonisjs/core/exceptions'
import { StatusCodes } from 'http-status-codes'
import { UserRegister, UserLogin, RefreshToken } from '#validators/auth'

export class AuthService {
  private prisma: PrismaClient

  constructor() {
    this.prisma = PrismaService.getInstance()
  }

  /**
   * Authenticates a user with email and password.
   * @param payload - User login data
   * @returns AuthResponse with token information
   */
  async login(payload: UserLogin): Promise<AuthResponse> {
    const user = await this.findUser(payload.email)
    if (!user || !(await this.verifyPassword(payload.password, user.password))) {
      throw new Exception('User not found or password does not match.', {
        status: StatusCodes.UNAUTHORIZED, // Changed to UNAUTHORIZED for clarity
      })
    }
    return this.generateAuthResponse(user)
  }

  /**
   * Registers a new user with the provided data.
   * @param payload - Registration data for new user
   * @returns AuthResponse with token information for the new user
   */
  async register(payload: UserRegister): Promise<AuthResponse> {
    if (await this.findUser(payload.email)) {
      throw new Exception('Email is already in use.', { status: StatusCodes.CONFLICT })
    }

    if (payload.password !== payload.passwordConfirm) {
      throw new Exception('Passwords do not match.', { status: StatusCodes.BAD_REQUEST })
    }

    const user = await this.createUser(payload)
    return this.generateAuthResponse(user)
  }

  /**
   * Creates a new user in the database.
   * @param payload - User registration data
   * @returns User object from database
   */
  private async createUser(payload: UserRegister): Promise<User> {
    const hashedPassword = await this.hashPassword(payload.password)
    return await this.prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        lastName: payload.lastName,
        createdAt: dayjs().unix(),
        isActive: true,
        password: hashedPassword,
      },
    })
  }

  /**
   * Finds a user by email.
   * @param email - User's email
   * @returns User if found, null otherwise
   */
  private async findUser(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } })
  }

  /**
   * Verifies if the provided password matches the hashed password.
   * @param password - Plain text password
   * @param hashedPassword - Hashed password from database
   * @returns True if passwords match, false otherwise
   */
  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await hash.verify(hashedPassword, password)
  }

  /**
   * Hashes the provided password.
   * @param password - Password to hash
   * @returns Hashed password
   */
  private async hashPassword(password: string): Promise<string> {
    return await hash.make(password)
  }

  /**
   * Generates a JWT token for a user.
   * @param userId - ID of the user
   * @param expiresAt - Expiration time in seconds since epoch (undefined for no expiration)
   * @returns JWT token string
   */
  private async generateJwt(userId: string, expiresAt?: number): Promise<string> {
    const secret = new TextEncoder().encode(env.get('JWT_SECRET'))
    return new jose.SignJWT({ sub: userId, iat: dayjs().unix(), exp: expiresAt })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret)
  }

  /**
   * Generates authentication response including access and refresh tokens.
   * @param user - User object
   * @param refreshToken - Optional existing refresh token to reuse
   * @returns AuthResponse object
   */
  private async generateAuthResponse(user: User, refreshToken?: string): Promise<AuthResponse> {
    const expiresAt = dayjs().add(5, 'minutes').unix()
    const accessToken = await this.generateJwt(user.id, expiresAt)
    const newRefreshToken = refreshToken || (await this.generateJwt(user.id)) // Use refresh token if provided

    return {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiresIn: expiresAt,
      refreshTokenExpiresIn: null,
      tokenType: 'Bearer',
    }
  }

  /**
   * Refreshes the access token using the refresh token.
   * @param data - Contains the refresh token
   * @returns New AuthResponse with refreshed token
   */
  async refresh(data: RefreshToken): Promise<AuthResponse> {
    const payload = await this.verifyJwt(data.refreshToken)
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub as string } })

    if (!user) {
      throw new Exception('User not found.', { status: StatusCodes.BAD_REQUEST })
    }
    return this.generateAuthResponse(user, data.refreshToken)
  }

  async verifyJwt(token: string): Promise<jose.JWTPayload> {
    const JWT_SECRET = env.get('JWT_SECRET')

    try {
      const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

      return payload
    } catch (error) {
      throw new Exception('Invalid token. Try to log in again.', {
        status: StatusCodes.UNAUTHORIZED,
      })
    }
  }
}
