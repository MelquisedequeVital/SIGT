/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        sigt: {
          primary: '#0B5AA6',
          bg: '#EAF3FB',
          text: '#1E3A5F',
        },
      },
    },
  },
  plugins: [],
};
