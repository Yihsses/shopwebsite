import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue3-cookies'
const app = createApp(App)
app.use(router)
app.use(VueCookies)
app.mount('#app')
// createApp(App).use(router).mount('#app')
// createApp(App).use(vue3-cookies).mount('#app')
