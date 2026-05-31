/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f7fb',
          100: '#e7eef8',
          200: '#c7d5ec',
          300: '#9fb7dd',
          400: '#7094c9',
          500: '#496ea6',
          600: '#34517d',
          700: '#243a5a',
          800: '#162536',
          900: '#09111d',
          950: '#050b13'
        },
        gold: {
          50: '#fff8e8',
          100: '#ffefc0',
          200: '#ffe08a',
          300: '#f8c953',
          400: '#e7b11b',
          500: '#c9920a',
          600: '#9f7207',
          700: '#795706',
          800: '#583e04',
          900: '#372504'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 20px 70px rgba(18, 29, 54, 0.18)'
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(231,177,27,0.18), transparent 35%), radial-gradient(circle at right center, rgba(73,110,166,0.18), transparent 30%), linear-gradient(135deg, rgba(9,17,29,0.98), rgba(22,37,54,0.94))'
      }
    }
  },
  plugins: []
};