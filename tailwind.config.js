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
      'barlow-extraBold': ['BarlowSemiCondensed-ExtraBold', 'sans-serif'],
      'barlow-medium': ['BarlowSemiCondensed-Medium', 'sans-serif'],
    },

    colors: {
      'primary': {
        DEFAULT: '#276CDC',
        100: '#0099FF',
        200: '#3478E6'
      },
      'secondary': {
        DEFAULT: '#000000',
        100: '#616461',
        200: '#424542',
        300: '#343734'
      },
      'tertiary': '#5B68F0',
      'quaternary': '#FFFFFF'
    },

    extend: {},
  },
  plugins: [],
}