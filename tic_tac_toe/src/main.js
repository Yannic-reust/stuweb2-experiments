import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store/index'
import router from './router'

createApp(App).use(router).use(store).mount('#app')
