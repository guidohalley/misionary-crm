// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E9FC87',        // Verde neón
        background: '#262626',      // Gris oscuro
        contrast: '#F2F2F2',        // Blanco
        accent: '#BCB4FF',          // Violeta claro
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

export default config;
