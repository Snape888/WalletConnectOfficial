/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class', // Enables dark mode using a class
  theme: {
    extend: {
      fontFamily: {
        MyriadProBold: ['MyriadPro-Bold'],
        MyriadProBoldCondensed: ['MyriadPro-Bold-Condensed'],
        MyriadProBoldCondensedItalic: ['MyriadPro-Bold-Condensed-Italic'],
        MyriadProBoldItalic: ['MyriadPro-Bold-Italic'],
        MyriadProCondensed: ['MyriadPro-Condensed'],
        MyriadProCondensedItalic: ['MyriadPro-Condensed-Italic'],
        MyriadProLight: ['MyriadPro-Light'],
        MyriadProRegular: ['MyriadPro-Regular'],
        MyriadProSemibold: ['MyriadPro-Semibold'],
        MyriadProSemiboldItalic: ['MyriadPro-Semibold-Italic'],
        sans: ['MyriadPro-Regular', 'sans-serif']
      },
      borderRadius: {
        'small': '4px',
        'large': '12px',
        'none': '0'
      },
      screens: {
        'xs': '450px',
      },
      colors: {
        whitePrim: {
          light: '#ffffff',
          dark: '#000000'
        },
        blackPrim: {
          light: '#000000',
          dark: '#ffffff'
        },
        navyPrim: {
          light: '#09437C',
          dark: '#09437C'
        },
        bluePrim: {
          light: '#00A0D8',
          dark: '#00A0D8'
        },
        yellowPrim: {
          light: '#FFAA00',
          dark: '#FFAA00'
        },
        orangePrim: {
          light: '#E86500',
          dark: '#E86500'
        },
        greyed: {
          light: '#757575',
          dark: '#191919'
        },
        offWhite: {
          light: '#F9F9F9',
          dark: '#191919'
        }
      }
    }
  },
  safelist: [
    'bg-whitePrim-light', 'bg-whitePrim-dark',
    'bg-blackPrim-light', 'bg-blackPrim-dark',
    'bg-navyPrim-light', 'bg-navyPrim-dark',
    'bg-bluePrim-light', 'bg-bluePrim-dark',
    'bg-yellowPrim-light', 'bg-yellowPrim-dark',
    'bg-orangePrim-light', 'bg-orangePrim-dark',
    'bg-greyed-light', 'bg-greyed-dark',
    'bg-offWhite-light', 'bg-offWhite-dark',
    'border-whitePrim-light', 'border-whitePrim-dark',
    'border-blackPrim-light', 'border-blackPrim-dark',
    'border-navyPrim-light', 'border-navyPrim-dark',
    'border-bluePrim-light', 'border-bluePrim-dark',
    'border-yellowPrim-light', 'border-yellowPrim-dark',
    'border-orangePrim-light', 'border-orangePrim-dark',
    'border-greyed-light', 'border-greyed-dark',
    'border-offWhite-light', 'border-offWhite-dark',
  ],
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      };
      addUtilities(newUtilities);
    }
  ]
};


/** @type {import('tailwindcss').Config}
const myColors = {
  //whitePrim: '#ffffff',  // White
  //blackPrim: '#000000', // Black
  //navyPrim: '#09437C', // Navy
  //bluePrim: '#00A0D8', // Blue
  //yellowPrim: '#FFAA00', // Warm yellow
  //orangePrim: '#E86500', // Blood Orange
  //greyed: '#757575',    // Greyed
  //offWhite: '#F9F9F9', //offWhite
} **/
 