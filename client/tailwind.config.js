/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
        textColor: '#c5cbd1',
        background: '#050e15',
        primary: '#e2e5e8',
        secondary: '#BFD9C0',
        accent: '#1b584c',

      },
      fontFamily: {
        raleway: ['Raleway'],
        nunito: ['Nunito Sans'],
        librefranklin: ['Libre Franklin']
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

