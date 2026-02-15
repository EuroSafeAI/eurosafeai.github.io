/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f6fc',
          100: '#e8ecf9',
          200: '#c5cdf0',
          300: '#9fade5',
          400: '#7a8dd8',
          500: '#5a6dca',
          600: '#4253b3',
          700: '#3544a0',
          800: '#2a3585',
          900: '#1f2768',
        },
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

