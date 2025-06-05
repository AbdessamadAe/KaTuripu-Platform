module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'manjari': ['var(--font-manjari)', 'Manjari', 'sans-serif'],
        'sans': ['var(--font-manjari)', 'Manjari', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
