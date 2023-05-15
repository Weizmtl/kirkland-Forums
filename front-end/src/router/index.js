import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: "layout",
      component: () => import('@/views/Layout.vue'),
      children: [{
        path: '/',
        name: "AlL Articles",
        component: () => import('@/views/forum/ArticleList.vue'),
      }]
    }
  ]
})

export default router
