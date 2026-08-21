import { Datepicker } from 'vanillajs-datepicker'
import fr from 'vanillajs-datepicker/locales/fr'

import 'vanillajs-datepicker/css/datepicker.css'

Object.assign(Datepicker.locales, fr)

/**
 * Initialise la date pickers de réservation (date de départ / date de retour)
 * et empêche de sélectionner une date de retour antérieure à la date de départ.
 */
export function initBookingDatepickers() {
  const startDate = document.querySelector('#booking_startDate')
  const endDate = document.querySelector('#booking_endDate')

  if (!startDate || !endDate) {
    return
  }

  const datepickerStart = new Datepicker(startDate, {
    language: 'fr-BE',
    format: 'dd/mm/yyyy',
    minDate: new Date(),
  })

  const datepickerEnd = new Datepicker(endDate, {
    language: 'fr-BE',
    format: 'dd/mm/yyyy',
    minDate: datepickerStart.getDate() || new Date(),
  })

  startDate.addEventListener('changeDate', () => {
    const selectedStart = datepickerStart.getDate()

    datepickerEnd.setOptions({ minDate: selectedStart })

    const selectedEnd = datepickerEnd.getDate()
    if (selectedEnd && selectedStart && selectedEnd < selectedStart) {
      datepickerEnd.setDate({ clear: true })
    }
  })

  return { datepickerStart, datepickerEnd }
}
