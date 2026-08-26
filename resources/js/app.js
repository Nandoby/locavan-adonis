import Alpine from 'alpinejs'
import Splide from '@splidejs/splide'
import { Lightbox } from 'lightbox3'
import { initBookingDatepickers } from './datepicker.js'

import '@splidejs/splide/css'

Alpine.data('alert', function () {
  return {
    isVisible: false,
    dismiss() {
      this.isVisible = false
    },
    init() {
      setTimeout(() => {
        this.isVisible = true
      }, 80)
      setTimeout(() => {
        this.dismiss()
      }, 5000)
    },
  }
})

Alpine.data('burger', function () {
  return {
    isVisible: false,

    toggle() {
      this.isVisible = !this.isVisible
    },
  }
})

Alpine.data('dropdown', function () {
  return {
    dropped: false,

    toggle() {
      this.dropped = !this.dropped
    },
  }
})

Alpine.data('preview', function () {
  return {
    previews: [],

    handleFiles(event) {
      const { files } = event.target
      // Révoquer les anciennes URLs
      this.previews.forEach((url) => URL.revokeObjectURL(url))

      // Construire le nouveau tableau à partir d'event.target.files
      this.previews = [...files].map((file) => URL.createObjectURL(file))
    },
  }
})

Alpine.start()

document.querySelectorAll('.splide').forEach((el) => {
  new Splide(el, {
    type: 'loop',
    perPage: 1,
    pagination: true,
    arrows: true,
    autoplay: true,
  }).mount()
})

Lightbox.init()

initBookingDatepickers()
