/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'default-theme': 'hsla(var(--b1) / var(--tw-bg-opacity, 1))'
      },
      gridAutoRows: {
        20: '20px'
      },
      gridRowEnd: {
        4: 'span 4',
        6: 'span 6',
        8: 'span 8'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')]
}
