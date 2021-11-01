/**
 * Tailwind configuration for floofy.dev
 */
module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'src/components/**/*.vue',
      'src/layouts/**/*.vue',
      'src/plugins/**/*.ts',
      'src/views/**/*.vue',
      'nuxt.config.{js,ts}',
    ],
  },
  darkMode: 'media', // or 'media' or 'class'
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        discord: '#7289DA',
        github: '#333333',
        twitter: '#1DA1F2',
        telegram: '#0088CC',
        steam: '#000000',
      },

      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
