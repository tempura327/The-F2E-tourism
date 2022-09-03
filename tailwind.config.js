/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{html,vue,js}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '28px',
      },
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
      error: '#dc3545',
      warning: 'gold',
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
    extend: {
      screens: {
        // changed from @media (min-width:...) into @media (max-width:...)
        '2xl': { max: '1536px' },
        xl: { max: '1280px' },
        lg: { max: '1024px' },
        md: { max: '768px' },
        sm: { max: '680px' },
        xs: { max: '428px' },
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        // set width of container at certain breakpoint.
        '.container': {
          width: '80%',
          '@screen 2xl': {
            width: '1280px',
          },
          '@screen lg': {
            width: '768px',
          },
          '@screen md': {
            width: '576px',
          },
          '@screen xs': {
            width: '414px',
            padding: '0 20px',
          },
        },
      });
    },
  ],
};
