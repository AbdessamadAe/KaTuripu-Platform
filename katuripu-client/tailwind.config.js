/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", './public/index.html'],
  theme: {
    extend: {
      colors: {
        'custom-color1': '#aa74fa',
        'custom-color2': '#7B2CBC',
      }
    },
  },
  plugins: [],
}

