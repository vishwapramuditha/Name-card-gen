/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sinhala: ['"Noto Sans Sinhala"', 'sans-serif'],
                abhaya: ['"Abhaya Libre"', 'serif'],
                emanee: ['"FM-Emanee"', '"Noto Sans Sinhala"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
