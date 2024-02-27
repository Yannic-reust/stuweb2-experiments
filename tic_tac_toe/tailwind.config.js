/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,vue}",
    "./src/components/**/*.{js,ts,vue}",
    "./src/app/**/*.{js,ts,vue}",
  ],
  theme: {
    colors: {
      darkgrey: '#1F1F2F',
      lightgrey: '#49475C',
      pink: '#D87D9B',
      orange: '#F19871',
      white: '#FFFFFF',
     
    },
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      /*sonar: ['sonar-sans', 'sans-serif'], // main font
      karmina: ['karmina', 'serif'], // title font*/
    },
    fontSize: {
      'h-xl': ['100px', { lineHeight: '110px', fontWeight: '700', fontFamily: 'roboto' }], // desktop hero text
      'h-lg': ['70px', { lineHeight: '86px', fontWeight: '700', fontFamily: 'roboto' }], // desktop title
      'h-l': ['56px', { lineHeight: '64px', fontWeight: '700', fontFamily: 'roboto' }], // desktop title
      'h-md': ['35px', { lineHeight: '45px', fontWeight: '700', fontFamily: 'roboto' }], // desktop sub title
      'h-sm': ['30px', { lineHeight: '35px', fontWeight: '700', fontFamily: 'roboto' }], // desktop sub title
      'h-xs': ['25px', { lineHeight: '35px', fontWeight: '400', fontFamily: 'roboto' }], // desktop sub title
      'b-md': ['25px', { lineHeight: '45px', fontWeight: '700', fontFamily: 'roboto' }], // button text
      'p-lg': ['20px', { lineHeight: '26px', fontWeight: '400', fontFamily: 'roboto' }], // desktop text
      'p-sm': ['18px', { lineHeight: '24px', fontWeight: '400', fontFamily: 'roboto' }], // mobile text
      
      /*'h-xs': ['20px', { lineHeight: '26px', fontWeight: '700', fontFamily: 'Palanquin' }], // mobile sub title
      'p-lg': ['18px', { lineHeight: '28px', fontWeight: '400', fontFamily: 'Palanquin' }], // desktop text
      'p-sm': ['18px', { lineHeight: '28px', fontWeight: '400', fontFamily: 'Palanquin' }], // mobile text
      'p-xs': ['14px', { lineHeight: '18px', fontWeight: '400', fontFamily: 'Palanquin' }], // tiny text
      'label': ['12px', { lineHeight: '16px', fontWeight: '500', fontFamily: 'Palanquin' }], // labels*/
    },
    extend: { fontFamily: { sans: ['Palanquin'], }, } // set default font
  },
  plugins: [],
};
