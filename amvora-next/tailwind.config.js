/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: '#c5a059',
      },
      fontFamily: {
        cairo: ['Almarai', 'sans-serif'],
        body: ['Almarai', 'sans-serif'],
        display: ['El Messiri', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
