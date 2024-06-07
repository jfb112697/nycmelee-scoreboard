/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'nycmelee-bg': '#0e1c23',
        'nycmelee-border-light': 'rgba(0, 180, 216, 0.47)',
        'nycmelee-border': '#00B4D8',
        'nycmelee-dark-bg': '#0D1B2A',
        'nycmelee-grey-bg': '#4D4D4D',
        'nycmelee-dark': '#1C263B',
        'nycmelee-white': '#FFFFFF',
        'nycmelee-light-grey': '#E8E8E8',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      spacing: {
        '2.5': '10px',
        '3.75': '15px',
        '[33px]': '33px',
        '[11px]': '11px',
        '[19px]': '19px',
        '[6px]': '6px',
        '[25px]': '25px',
        '[20px]': '20px',
        '[10px]': '10px',
      },
      width: {
        '[666px]': '666px',
        '[76.03px]': '76.03px',
        '[88px]': '88px',
        '[62px]': '62px',
        '[117px]': '117px',
        '[128px]': '128px',
        '[51px]': '51px',
        '[83px]': '83px',
        '[238px]': '238px',
        '[174px]': '174px',
        '[418px]': '418px',
      },
      height: {
        '[564px]': '564px',
        '[100px]': '100px',
        '[454px]': '454px',
        '[24px]': '24px',
        '[36px]': '36px',
        '[44px]': '44px',
        '[78px]': '78px',
      },
      maxHeight: {
        '[100px]': '100px',
      },
    },
  },
  plugins: [],
}

