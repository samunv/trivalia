/** @type {import('tailwindcss').Config} */
import animations from '@midudev/tailwind-animations'

export default {
  theme: {
    extend: {
      colors: {
        'azul': '#113270',
        'azul-claro': '#dde9ff',
        'azul-oscuro': '#0f2c63'
      },
      fontFamily: {
        interRegular: ['Inter-regular', 'sans-serif'],
        interBold: ['Inter-bold'],
        interExtrabold: ['Inter-extrabold'],
        nunito: ['nunito']
      }
    },
  },
  plugins:[
    animations
  ]
}
