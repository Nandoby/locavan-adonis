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
  const datesDisabled = (startDate.dataset.datesDisabled || '').split(',').filter(Boolean)

  const disabledDatesSorted = datesDisabled
    .map((date) => {
      const dateSplitted = date.split('/')
      const day = dateSplitted[0]
      const month = dateSplitted[1]
      const year = dateSplitted[2]

      return new Date(year, month - 1, day)
    })
    .sort((a, b) => a - b)
  const endDate = document.querySelector('#booking_endDate')

  if (!startDate || !endDate) {
    return
  }

  const datepickerStart = new Datepicker(startDate, {
    language: 'fr-BE',
    format: 'dd/mm/yyyy',
    datesDisabled: datesDisabled,
    minDate: new Date(),
  })

  const datepickerEnd = new Datepicker(endDate, {
    language: 'fr-BE',
    format: 'dd/mm/yyyy',
    datesDisabled: datesDisabled,
    minDate: datepickerStart.getDate() || new Date(),
  })

  startDate.addEventListener('changeDate', () => {
    const selectedStart = datepickerStart.getDate()

    const nextDisabled = findNextDisabledDate(selectedStart, disabledDatesSorted)
    let maxEndDate = null
    if (nextDisabled) {
      maxEndDate = new Date(nextDisabled)
      maxEndDate.setDate(maxEndDate.getDate() - 1)
    }

    datepickerEnd.setOptions({ minDate: selectedStart, maxDate: maxEndDate })

    const selectedEnd = datepickerEnd.getDate()
    if (
      (selectedEnd && selectedStart && selectedEnd < selectedStart) ||
      (selectedEnd && maxEndDate !== null && selectedEnd > maxEndDate)
    ) {
      datepickerEnd.setDate({ clear: true })
    }
  })

  return { datepickerStart, datepickerEnd }
}

function findNextDisabledDate(afterDate, disabledDatesSorted) {
  return disabledDatesSorted.find((disabledDate) => {
    return disabledDate > afterDate
  })
}
