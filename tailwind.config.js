/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
       colors: {
        // Colors from the indigo-pink theme
        'primary': '#3F51B5', // Indigo
        'accent': '#FF4081',  // Pink
        'warn': '#F44336',  
        'success': '#4CAF50',  // Red
      },
      borderRadius: {
        'xl': '1rem',
        'lg': '0.75rem',
        'md': '0.5rem',
      }
    },
  },
  plugins: [],
};