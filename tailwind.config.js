/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",  // nếu dùng Next.js 13+ app dir
    "./app/**/*.{js,ts,jsx,tsx,mdx}",  // hỗ trợ app directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
