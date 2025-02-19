import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().trim().minLength(6),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().trim().minLength(6),
    passwordConfirm: vine.string().trim().minLength(6),
    name: vine.string().trim().minLength(2),
    lastName: vine.string().trim().minLength(2),
  })
)

export const refreshTokenValidator = vine.compile(
  vine.object({
    refreshToken: vine.string().trim(),
  })
)

export type UserLogin = Infer<typeof loginValidator>
export type UserRegister = Infer<typeof registerValidator>
export type RefreshToken = Infer<typeof refreshTokenValidator>
