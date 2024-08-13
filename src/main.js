import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import './main.css' // 引入客製化 css
import "./tailwindcss.css" // 導入css/tailwindcss.css到main.js，這樣就讓專案擁有了Tailwind CSS

createApp(App).mount('#app')
// 註冊App.vue中的app
// <div id="app"></div>
