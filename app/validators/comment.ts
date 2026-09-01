import vine from '@vinejs/vine'
import { imageFile } from '#validators/rules'

export const commentValidator = vine.create({
  content: vine.string().trim(),
  memories: vine.array(imageFile()).maxLength(5).optional(),
  rating: vine.number().min(1).max(5),
})
