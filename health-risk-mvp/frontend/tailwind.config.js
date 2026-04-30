/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0F766E', light: '#CCFBF1', dark: '#115E59' },
        risk: { low: '#16A34A', moderate: '#D97706', high: '#DC2626' },
      }
    }
  },
  plugins: [],
}
