/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,vue,js}'],
  theme: {
    container: {
      center: true,
    },
    colors: {
      primary: '#08A6BB',
      'gray-40': '#CBCBCB',
      'gray-60': '#AEAEAE',
      'gray-80': '#525151',
      'gray-100': '#313131',
      'gray-blue': '#6F7789',
      white: '#ffffff',
      transparent: 'rgba(0,0,0,0)',
    },
    fontFamily: {
      primary: ['Roboto', 'Nunito Sans'],
    },
    fontSize: {
      xl: '48px',
      h1: '30px',
      h2: '28px',
      h3: '24px',
      h4: '20px',
      h5: '16px',
      h6: '12px',
    },

    extend: {},
  },
  plugins: [],
};
