import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import ScientifiqueHomeView from "../views/ScientifiqueHomeView.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/scientifique/:nomScientifique',
    name: 'scientifique',
    component: ScientifiqueHomeView,
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})
export default router
