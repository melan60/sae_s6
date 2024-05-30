import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store';
import { BootstrapVue, IconsPlugin, BIcon, ModalPlugin, ButtonPlugin } from 'bootstrap-vue';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import * as VueAos from 'vue-aos';

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
Vue.use(ModalPlugin);
Vue.use(ButtonPlugin);
Vue.use(VueAos);

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.component('BIcon', BIcon);

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    store.dispatch('logout'); // Use store directly
    router.push('/login'); // Use router directly
  }
  return Promise.reject(error);
});

new Vue({
  router,
  store,
  created() {
    AOS.init();

    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.$store.commit('setAuthentication', true);

      axios.get('/api/me') // Fetch current user data from this endpoint
          .then(response => {
            this.$store.commit('setUser', response.data);

            // Now that the user data is set, you can make your API call to get the graphs
            this.$store.dispatch('fetchUserGraphs', response.data._id);
          })
          .catch(() => {
            // If the token is invalid, remove it
            localStorage.removeItem('token');
            this.$store.commit('clearUser');
          });
    }
  },
  render: h => h(App)
}).$mount('#app');
