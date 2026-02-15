/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d229ec7',
        secondary: '#3e5f75',
        accent: '#09f',
      },
      fontFamily: {
        inter: ['Inter', 'Arial', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

