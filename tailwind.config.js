/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{html,ts,js}'],
  theme: {
    fontFamily: {
      montserrat: ['Montserrat', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'night'],
  },
};


