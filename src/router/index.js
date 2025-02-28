import { createRouter, createWebHistory } from 'vue-router'
import ChessGame from '../views/ChessGame.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChessGame
    }
  ]
})

export default router
