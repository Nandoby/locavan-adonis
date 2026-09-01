import vine from '@vinejs/vine'

export const imageFile = () => vine.file({ size: '2mb', extnames: ['jpg', 'jpeg', 'png', 'webp'] })
