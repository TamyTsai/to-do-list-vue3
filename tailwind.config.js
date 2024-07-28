/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // 在配置文件content中添加所有模板文件的路径
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

