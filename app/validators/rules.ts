import vine from '@vinejs/vine'

export const imageFile = () => vine.file({ size: '2mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })

export const email = () => vine.string().trim().email().maxLength(254)

export const password = () => vine.string().minLength(8).maxLength(32)
