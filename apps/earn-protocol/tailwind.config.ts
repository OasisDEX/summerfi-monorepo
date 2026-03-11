import { type Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: [
    'variant',
    ['@media (prefers-color-scheme: light) { &:not(.dark, .dark *) }', '&:is(.light, .light *)'],
  ],
} as Config
