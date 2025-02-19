import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { AuthService } from '#services/utils/auth_service'
import { loginValidator, refreshTokenValidator, registerValidator } from '#validators/auth'
import { Validator } from '../lib/validator.js'

/**
 * AuthController class handles authentication-related HTTP requests.
 * It uses dependency injection for managing services.
 */
@inject()
export default class AuthController {
  /**
   * Constructor for AuthController.
   * @param authService - An instance of AuthService for handling auth operations.
   */
  constructor(private authService: AuthService) {}

  /**
   * Handles user login.
   * @param context - HTTP context containing the request.
   * @returns A Promise that resolves with the login result.
   */
  async login({ request }: HttpContext): Promise<object> {
    const payload = await Validator.validateRequest(request, loginValidator)
    return await this.authService.login(payload)
  }

  /**
   * Handles user registration.
   * @param context - HTTP context containing the request.
   * @returns A Promise that resolves with the registration result.
   */
  async register({ request }: HttpContext): Promise<object> {
    const payload = await Validator.validateRequest(request, registerValidator)
    return await this.authService.register(payload)
  }

  /**
   * Refreshes user's authentication token.
   * @param context - HTTP context containing the request.
   * @returns A Promise that resolves with the refreshed token.
   */
  async refresh({ request }: HttpContext): Promise<object> {
    const payload = await Validator.validateRequest(request, refreshTokenValidator)
    return await this.authService.refresh(payload)
  }
}
