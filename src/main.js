import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import mitt from 'mitt'

const emitter = mitt();

createApp(App).config.globalProperties.emitter = emitter
createApp(App).use(router).mount('#app')
createApp(App).use(VueAxios, axios)