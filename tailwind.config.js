/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Old framer color codes:
        // primary: {
        //   50: '#f4f6fc',
        //   100: '#e8ecf9',
        //   200: '#c5cdf0',
        //   300: '#9fade5',
        //   400: '#7a8dd8',
        //   500: '#5a6dca',
        //   600: '#4253b3',
        //   700: '#3544a0',
        //   800: '#2a3585',
        //   900: '#1f2768',
        // },
        primary: {
          50:  '#f0f8ff',
          100: '#e0f0fe',
          200: '#b9e1fd',
          300: '#89CFF0',
          400: '#56b5e9',
          500: '#2f9bdd',
          600: '#1a7fc4',
          700: '#1566a0',
          800: '#145380',
          900: '#134468',
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

