/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      'barlow-bold': ['BarlowSemiCondensed-Bold', 'sans-serif'],
      // 'barlow-extraBold': ['BarlowSemiCondensed-ExtraBold', 'sans-serif'],
      'barlow-medium': ['BarlowSemiCondensed-Medium', 'sans-serif'],
      'barlow-regular': ['BarlowSemiCondensed-Regular', 'sans-serif'],
      'barlow-semibold': ['BarlowSemiCondensed-SemiBold', 'sans-serif'],
    },

    colors: {
      'primary': {
        DEFAULT: '#276CDC',
        100: '#0099FF',
        200: '#3478E6',
        300: '#5B68F8',      
        400: '#AFCBFF',      
        500: '#CFE2FF',      
        600: '#EAF4FF' 
      },
      'secondary': {
        DEFAULT: '#000000',
        100: '#616461',
        200: '#424542',
        300: '#343734',
        400: '#323434',      // gris oscuro nuevo
        500: '#767676',      // gris medio
        600: '#807C7C',      // gris 87%
        700: '#8C8C8C',      // gris 45%
        800: '#B3B3B3',      // gris claro
        900: '#D1D5DB',      // gris 200
        950: '#D9D9D9'
      },
      'danger': {
      DEFAULT: '#D64545',
      100: '#C5221F',
      200: '#C00F0C'
      },

      'quaternary': '#FFFFFF'
      
    },

    extend: {},
  },
  plugins: [],
}