import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";

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
    path: '/cobaye',
    name: 'cobaye',
    meta: { requiresAuth: true },
    component: HomeView,
  },
  {
    path: '/admin',
    name: 'admin',
    meta: { requiresAuth: true },
    component: HomeView,
  },
]

const router = new VueRouter({
  routes,
  mode: 'history'
})



export default router
