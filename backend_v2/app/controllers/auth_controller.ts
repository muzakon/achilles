import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { AuthService } from '#services/auth_service'
import { loginValidator, refreshTokenValidator, registerValidator } from '#validators/auth'

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
   * Validates the incoming request against a specified validator.
   * @template T - The type of the validator to use for validation.
   * @param request - The HTTP request object containing the data to validate.
   * @param validator - Validator object to validate the request data.
   * @returns A Promise resolving to the validated data or throwing an error if validation fails.
   */
  private async validateRequest<T>(request: HttpContext['request'], validator: T): Promise<any> {
    const data = request.all()
    return await validator.validate(data)
  }

  /**
   * Handles user login.
   * @param context - HTTP context containing the request.
   * @returns A Promise that resolves with the login result.
   */
  async login({ request }: HttpContext): Promise<object> {
    const payload = await this.validateRequest(request, loginValidator)
    return await this.authService.login(payload)
  }

  /**
   * Handles user registration.
   * @param context - HTTP context containing the request.
   * @returns A Promise that resolves with the registration result.
   */
  async register({ request }: HttpContext): Promise<object> {
    const payload = await this.validateRequest(request, registerValidator)
    return await this.authService.register(payload)
  }

  /**
   * Refreshes user's authentication token.
   * @param context - HTTP context containing the request.
   * @returns A Promise that resolves with the refreshed token.
   */
  async refresh({ request }: HttpContext): Promise<object> {
    const payload = await this.validateRequest(request, refreshTokenValidator)
    return await this.authService.refresh(payload)
  }
}
