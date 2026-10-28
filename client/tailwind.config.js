/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        severity: {
          critical: '#DC2626',
          high: '#EA580C',
          moderate: '#CA8A04',
          low: '#16A34A',
          info: '#2563EB',
        },
        status: {
          active: '#DC2626',
          responding: '#EA580C',
          contained: '#CA8A04',
          resolved: '#16A34A',
          monitoring: '#2563EB',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
