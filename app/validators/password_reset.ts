import vine from '@vinejs/vine'
import { email, password } from '#validators/rules'

export const forgotPasswordValidator = vine.create({
  email: email(),
})

export const resetPasswordValidator = vine.create({
  password: password().confirmed({
    as: 'passwordConfirmation',
  }),
})
