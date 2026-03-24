/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wa: {
          green: '#00a884',
          'green-dark': '#008069',
          dark: '#111b21',
          sidebar: '#111b21',
          'sidebar-hover': '#202c33',
          panel: '#0b141a',
          'chat-bg': '#0b141a',
          outgoing: '#005c4b',
          incoming: '#202c33',
          input: '#2a3942',
          header: '#202c33',
          border: '#2a3942',
          search: '#202c33',
          text: '#e9edef',
          'text-secondary': '#8696a0',
          'text-muted': '#667781',
          'unread-bg': '#00a884',
          teal: '#00a884',
          'deep-bg': '#0b141a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      },
      keyframes: {
        'typing-dot': {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      },
      animation: {
        'typing-dot': 'typing-dot 1.4s infinite ease-in-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'slide-in': 'slide-in 0.25s ease-out',
      }
    },
  },
  plugins: [],
}
