import { createRouter, createWebHistory } from 'vue-router'
import AccountManagement from '@/views/AccountManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AccountManagement
    }
  ]
})

export default router 