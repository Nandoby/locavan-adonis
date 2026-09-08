import vine from '@vinejs/vine'
import { email } from '#validators/rules'

export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})
