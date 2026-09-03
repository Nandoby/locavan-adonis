import vine from '@vinejs/vine'
import { imageFile } from '#validators/rules'

export const vehicleValidator = vine.create({
  model: vine.string().maxLength(50).trim(),
  type: vine.number().exists({ table: 'types', column: 'id' }),
  price: vine.number(),
  year: vine.number(),
  length: vine.number(),
  height: vine.number(),
  width: vine.number(),
  km: vine.number(),
  city: vine.string().alpha().maxLength(50),
  cleanWater: vine.number(),
  wasteWater: vine.number(),
  seats: vine.number(),
  beds: vine.number(),
  animals: vine.boolean(),
  travelAbroad: vine.boolean(),
  description: vine.string().trim(),
  pictures: vine.array(imageFile()),
})
