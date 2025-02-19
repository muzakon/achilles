import type { ApplicationService } from '@adonisjs/core/types'
import { PrismaService } from '#services/prisma_service'
import { PrismaClient } from '@prisma/client'

export default class PrismaProvider {
  private prisma: PrismaClient

  constructor(protected app: ApplicationService) {
    this.prisma = PrismaService.getInstance()
  }

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {
    try {
      await this.prisma.$disconnect()
    } catch (error) {
      console.error(error)
    }
  }
}
