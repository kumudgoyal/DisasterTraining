/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: [
          '"SF Mono"',
          'SFMono-Regular',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ],
      },
      colors: {
        cream: {
          50: '#FAF8F5',
          100: '#F5F2EB',
          200: '#EAE5DB',
          300: '#DED7C8',
        },
        ink: {
          900: '#111317',
          800: '#1E2229',
          700: '#323742',
          600: '#4B5261',
          400: '#7E8696',
          300: '#A1A9B8',
          200: '#CBD1DC',
          100: '#E7EAF0',
        },
        warm: {
          card: '#FFFFFF',
          cardSubtle: '#FDFCFB',
          accent: '#E65D2E',
          accentSoft: '#FFF1EB',
          sage: '#4A7C59',
          sageSoft: '#EBF4EE',
          ochre: '#D97706',
          ochreSoft: '#FEF3C7',
          sky: '#2563EB',
          skySoft: '#EFF6FF',
        },
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
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03), 0 10px 30px rgba(0, 0, 0, 0.04)',
        'pill': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'float': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
