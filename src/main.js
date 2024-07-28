import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import './main.css' // 引入自己寫的css
import "./tailwindcss.css" // 导入css/tailwindcss.css到main.js，这样就让你的项目拥有了Tailwind CSS

createApp(App).mount('#app')
// 註冊App.vue中的app
// <div id="app"></div>