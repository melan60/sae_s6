import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import { BootstrapVue, IconsPlugin, BIcon } from 'bootstrap-vue'
import axios from 'axios';

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.component('BIcon', BIcon)

axios.defaults.baseURL = 'http://localhost:5000';
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
