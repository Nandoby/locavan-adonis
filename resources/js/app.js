import Alpine from 'alpinejs'
import Splide from '@splidejs/splide'
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

Alpine.start()

document.querySelectorAll('.splide').forEach((el) => {
  new Splide(el, {
    type: 'loop',
    perPage: 1,
    pagination: true,
    arrows: true,
  }).mount()
})
