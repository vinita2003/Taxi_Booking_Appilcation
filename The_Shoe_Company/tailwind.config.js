/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{html,js}",
  ],
  theme: {
    extend: {
      screens: {
        'media1360': '1360px',
      },
    },
  },
  plugins: [],
}
