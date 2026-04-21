import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'bebas': ['var(--font-bebas)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        'dm-mono': ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        // Electric blue accents
        blue: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
      },
      backdropBlur: {
        '2xl': '40px',
      },
    },
  },
  plugins: [],
}

export default config
