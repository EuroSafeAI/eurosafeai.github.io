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
        fraunces: ['Fraunces', 'Georgia', 'serif'],
        jost: ['Jost', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'monospace'],
      },
      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-9px)' },
        },
        scaleBounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.4)' },
          '65%':  { opacity: '1', transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        'fade-slide-up':  'fadeSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':        'fadeIn 0.45s ease-out both',
        'float':          'floatY 6s ease-in-out infinite',
        'scale-bounce':   'scaleBounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
