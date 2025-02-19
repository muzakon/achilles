// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PrismaService } from '#services/prisma_service'
import { PrismaClient, User } from '@prisma/client'

@inject()
export default class UsersController {
  private prisma: PrismaClient

  constructor() {
    this.prisma = PrismaService.getInstance()
  }

  async all(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }
}
