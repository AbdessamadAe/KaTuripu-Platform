module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'purple-text-bg': "url('/images/title.svg')",
        'meteor-bg': "url('/images/Meteor.svg')",
      },
      colors: {
        'white-color': '#ffffff',
        'primary-color': '#4F55C1',
        'secondary-color': '#aa74fa',
        'section-bg-color': '#f0f8ff',
        'custom-btn-bg-color': '#e0aafe',
        'custom-btn-bg-hover-color': '#7B2CBC',
        'dark-color': '#000000',
        'p-color': '#717275',
        'border-color': '#e0aafe',
        'link-hover-color': '#13547a',
      },
      fontFamily: {
        body: ['Open Sans', 'sans-serif'],
        title: ['Montserrat', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
        Noto: ['Noto Naskh Arabic', 'serif']
      },
      fontSize: {
        'h1': '58px',
        'h2': '46px',
        'h3': '32px',
        'h4': '28px',
        'h5': '24px',
        'h6': '22px',
        'p': '20px',
        'menu': '14px',
        'btn': '18px',
        'copyright': '16px'
      },
      borderRadius: {
        'large': '100px',
        'medium': '20px',
        'small': '10px',
      },
      fontWeight: {
        'normal': 400,
        'medium': 500,
        'semibold': 600,
        'bold': 700,
      }
    },
  },
  plugins: [],
}
