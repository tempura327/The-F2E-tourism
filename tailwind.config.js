/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,vue,js}'],
  theme: {
    container: {
      center: true,
    },
    colors:{
      'primary':'#08A6BB',
      'light-gray':'#CBCBCB',
      'gray':'#AEAEAE',
      'gray-blue':'#6F7789',
      'dark-gray':'#525151',
      'white':'#ffffff',

    },
    fontFamily: {
      primary: ['Roboto', 'Nunito Sans'],
    },
    fontSize: {
      'xl':'48px',
      'h1': '30px',
      'h2': '28px',
      'h3': '24px',
      'h4': '20px',
      'h5': '16px',
      'h6': '12px',
    },

    
    extend: {},
  },
  plugins: []
}
