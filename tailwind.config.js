/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'geometrical': "url('../img/bg.svg')"
      },
      width: {
        '1/100': '1%',
      },
      gridTemplateColumns: {
        'root-lg': '240px 1fr', 
        'root-md': '100px 1fr',
        'list': '1fr 1fr auto',
        'heading': 'repeat(2, auto)'
      },
      gridTemplateRows: {
        'heading': 'repeat(2, auto)',
      }
    }
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.main-container': {
          '@apply bg-neutral-50 h-full flex flex-col col-span-1 rounded-t-2xl md:rounded-r-none md:rounded-s-3xl p-6 md:p-10 md:py-10 overflow-scroll hide-scrollbar': {},
        },
        '.small-root-container' : {
          '@apply block grid grid-cols-root-md bg-indigo-950 text-stone-900 h-screen overflow-y-scroll md:overflow-hidden': {},
        },
        '.root-container': {
          '@apply block md:grid lg:grid-cols-root-lg md:grid-cols-root-md bg-indigo-950 text-stone-900 h-screen overflow-y-scroll md:overflow-hidden': {},
        }
      })
    }
  ],
}