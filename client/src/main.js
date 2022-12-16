import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import App from './App.vue'
import router from './router';

import 'devextreme/dist/css/dx.light.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)

router.isReady().then(() => {
    app.component('v-select', vSelect)
       .mount('#app')
})
