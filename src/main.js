import 'normalize.css'
import 'bootstrap/dist/css/bootstrap.css'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'


createApp(App).use(store).mount('#app')
