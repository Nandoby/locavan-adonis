import vine from '@vinejs/vine'

export const bookingValidator = vine.create({
  booking_startDate: vine.date({ formats: ['DD/MM/YYYY'] }),
  booking_endDate: vine.date({ formats: ['DD/MM/YYYY'] }).afterField('booking_startDate'),
})
