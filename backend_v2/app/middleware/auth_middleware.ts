import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { StatusCodes } from 'http-status-codes'
import { inject } from '@adonisjs/core'
import { AuthService } from '#services/utils/auth_service'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    userId: string
  }
}

@inject()
export default class AuthMiddleware {
  constructor(protected authService: AuthService) {}

  async handle(ctx: HttpContext, next: NextFn) {
    const authorizationHeader = ctx.request.header('Authorization')
    if (!authorizationHeader) {
      throw new Exception('You are not logged in. You must log in to continue.', {
        status: StatusCodes.UNAUTHORIZED,
      })
    }

    const accessToken = authorizationHeader.replace('Bearer ', '')

    const payload = await this.authService.verifyJwt(accessToken)
    ctx.userId = payload.sub as string
    await next()
  }
}
