// import type { HttpContext } from '@adonisjs/core/http'
import {
  imageGenerationTaskStatusValidator,
  imageGenerationTaskValidator,
} from '#validators/image_generation_task'
import { HttpContext } from '@adonisjs/core/http'
import { VineValidator } from '@vinejs/vine'
import { inject } from '@adonisjs/core'
import { ImageGenerationTaskService } from '#services/image_generation_task_service'
import { Logger } from '@adonisjs/core/logger'

@inject()
export default class ImageGenerationTasksController {
  constructor(
    private imageGenerationTaskService: ImageGenerationTaskService,
    protected logger: Logger
  ) {}

  async create({ request, userId }: HttpContext): Promise<unknown> {
    const payload = await this.validateRequest(request, imageGenerationTaskValidator)
    return await this.imageGenerationTaskService.create(userId, payload)
  }

  async status({ request, userId }: HttpContext): Promise<unknown> {
    const payload = await this.validateRequest(request, imageGenerationTaskStatusValidator)
    return await this.imageGenerationTaskService.getTaskStatus(userId, payload)
  }

  private async validateRequest(
    request: HttpContext['request'],
    validator: VineValidator<any, any>
  ): Promise<any> {
    const data = request.all()
    return await validator.validate(data)
  }
}
