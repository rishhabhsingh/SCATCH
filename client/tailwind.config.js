/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A0A0A',
          50:  '#1A1A1A',
          100: '#111111',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C96A',
          dark:    '#A07830',
        },
        surface: {
          DEFAULT: '#1A1A1A',
          raised:  '#222222',
          border:  '#2A2A2A',
        },
        text: {
          primary:   '#F5F5F0',
          secondary: '#888888',
          disabled:  '#444444',
        },
        status: {
          success: '#2D6A4F',
          error:   '#C1121F',
          warning: '#C9A84C',
          info:    '#64B5F6',
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-l':  ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-m':  ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #111111 100%)',
      },
      boxShadow: {
        'gold':    '0 0 30px rgba(201, 168, 76, 0.15)',
        'gold-lg': '0 0 60px rgba(201, 168, 76, 0.25)',
        'dark':    '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        'luxury': '2px',
      }
    },
  },
  plugins: [],
}