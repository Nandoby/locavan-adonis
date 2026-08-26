import vine from '@vinejs/vine'

export const commentValidator = vine.create({
  content: vine.string().trim(),
  memories: vine.array(vine.file({ extnames: ['jpeg', 'jpg', 'png', 'svg'] })).optional(),
  rating: vine.number().min(1).max(5),
})
