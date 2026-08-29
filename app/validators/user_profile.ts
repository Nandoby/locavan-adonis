import vine from '@vinejs/vine'

const password = () => vine.string().minLength(8).maxLength(32)

export const UserProfileValidator = vine.create({
  firstname: vine.string().minLength(2).maxLength(255),
  lastname: vine.string().minLength(1).maxLength(255),
  password: password()
    .confirmed({
      as: 'passwordConfirm',
    })
    .nullable(),
  avatar: vine.file({ extnames: ['jpeg', 'jpg', 'png', 'svg'] }).optional(),
})
