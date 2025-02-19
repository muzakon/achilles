export enum TaskStatus {
  IN_QUEUE = 'IN_QUEUE',
  ERROR = 'ERROR',
  COMPLETED = 'COMPLETED',
}

interface Image {
  url: string
  width: number
  height: number
  content_type: string
}

interface Timings {
  inference: number
}

export interface GenerateImageResponse {
  status: TaskStatus
  request_id: string
  response_url: string
  status_url: string
  cancel_url: string
  logs: null
  metrics: {}
  queue_position: number
}

export interface QueuedImageTaskResponse {
  status: TaskStatus
  queue_position: number
  response_url: string
}

export interface ProcessedImageTaskResponse {
  images: Image[]
  timings: Timings
  seed: number
  has_nsfw_concepts: boolean[]
  prompt: string
}
