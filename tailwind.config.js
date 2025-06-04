export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        slowZoom: 'slowZoom 20s ease-in-out infinite',
        pulseCustom: 'pulseCustom 3s ease-in-out infinite',
      },
      keyframes: {
        slowZoom: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        pulseCustom: {
          '0%, 100%': { transform: 'translateX(0.5rem) scale(1)' },
          '50%': { transform: 'translateX(0.5rem) scale(1.02)' },
        },
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'cormorant': ['Cormorant', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};