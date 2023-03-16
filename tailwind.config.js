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
        "inset": "inset 5px 5px 4px rgba(174, 174, 192, 0.2), inset -5px -5px 4px rgba(255, 255, 255, 0.3);"
      }
    },
    fontFamily: {
      'body': [ 'DovemayoGothic' ]
      // display: [ 'GmarketSans' ]
    }
  },
  plugins: [],
}
