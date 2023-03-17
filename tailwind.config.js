module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "neumorphism": "#F0F0F3",
        "pink": "#FB7575",
      },
      boxShadow: {
        "inset": "inset 5px 5px 4px rgba(174, 174, 192, 0.2), inset -5px -5px 4px rgba(255, 255, 255, 0.3);",
        "insetthin": "-5px -5px 5px rgba(255, 255, 255, 0.4), 5px 5px 10px rgba(174, 174, 192, 0.2), inset -2px -2px 4px rgba(0, 0, 0, 0.1), inset 2px 2px 4px #FFFFFF;",
        "drop-insetthin": "inset 5px 5px 4px rgba(174, 174, 192, 0.2), inset -5px -5px 4px rgba(255, 255, 255, 0.3);"
      }
    },
    fontFamily: {
      'body': [ 'DovemayoGothic' ]
      // display: [ 'GmarketSans' ]
    }
  },
  plugins: [],
}
