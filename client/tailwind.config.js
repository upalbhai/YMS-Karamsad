/** @type {import('tailwindcss').Config} */
const flowbite = require('flowbite/plugin');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#EEEEEE',
        'custom-gray': '#686D76',
        'custom-black': '#373A40',
        'custom-orange': '#DC5F00',
        'custom-dark': '#2D3250',
        'custom-nav': '#B4B4B3',
        'custom-h1': '#004225',
        'custom-btn': '#153448'
      },
    },
  },
  plugins: [
    flowbite,
    require('tailwind-scrollbar'),
  ],
};
