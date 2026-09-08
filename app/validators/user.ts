import vine from '@vinejs/vine'
import { imageFile, email, password } from '#validators/rules'

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  firstName: vine.string(),
  lastName: vine.string(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password().confirmed({
    confirmationField: 'passwordConfirmation',
  }),
  avatar: imageFile().optional(),
})
