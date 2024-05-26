/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontWeight: {
        hairline: 100,
        'extra-light': 200,
        thin: 300,
        light: 400,
        normal: 500,
        medium: 600,
        semibold: 700,
        bold: 800,
        'extra-bold': 900,
        black: 950,
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        
        primary: '#3490dc',
        secondary: '#ffed4a',
        danger: '#e3342f',
        customBlue: '#1E3A8A',
        customGreen: '#10B981',
        customGray: '#6B7280',
        headerText: '#204040',
        customCyan: '#70CACB',
        customIndigo: '#160042',
        customDarkGrey: '#333333'
      },
      borderWidth: {
        '0.6': '0.6px',
      },
    },
  },
  plugins: [],
};
