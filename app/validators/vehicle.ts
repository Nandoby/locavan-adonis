import vine from '@vinejs/vine'
import { imageFile } from '#validators/rules'

const currentYear = new Date().getFullYear()

/**
 * Champs communs création / édition d'une annonce (hors photos).
 */
const vehicleFields = {
  model: vine.string().trim().maxLength(50),
  type: vine.number().exists({ table: 'types', column: 'id' }),
  price: vine.number().positive().max(100000),
  year: vine
    .number()
    .min(1950)
    .max(currentYear + 1),
  length: vine.number().positive().max(20),
  height: vine.number().positive().max(5),
  width: vine.number().positive().max(4),
  km: vine.number().min(0).max(2000000),
  city: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(50)
    .regex(/^\p{L}[\p{L}\s'-]*$/u),
  cleanWater: vine.number().min(0).max(1000),
  wasteWater: vine.number().min(0).max(1000),
  seats: vine.number().min(1).max(9),
  beds: vine.number().min(1).max(12),
  animals: vine.boolean(),
  travelAbroad: vine.boolean(),
  description: vine.string().trim().maxLength(5000),
}

/** Création : au moins une photo obligatoire. */
export const vehicleValidator = vine.create({
  ...vehicleFields,
  pictures: vine.array(imageFile()).minLength(1),
})

/** Édition : les photos sont optionnelles (celles existantes sont conservées). */
export const vehicleUpdateValidator = vine.create({
  ...vehicleFields,
  pictures: vine.array(imageFile()).optional(),
})

/** Changement de statut d'une annonce depuis « Mes annonces ». */
export const vehicleStatusValidator = vine.create({
  status: vine.enum(['draft', 'published', 'paused']),
})
