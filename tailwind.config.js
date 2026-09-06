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
        navy: '#0f1f3d',
        'navy-light': '#1c3a63',
        teal: '#2f8fa3',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        body: ['Cairo', 'sans-serif'],
        display: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
