/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        void: '#050505',
        charcoal: '#1a1a1a',
        'signal-orange': '#ff6b35',
        'electric-cyan': '#00d9ff',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

