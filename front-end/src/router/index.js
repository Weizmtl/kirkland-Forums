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
      },{
        path: '/forum/:pBoardId',
        name: "Primary Plate",
        component: () => import('@/views/forum/ArticleList.vue'),
      },{
        path: '/forum/:pBoardId/:boardId/',
        name: "Secondary Plate",
        component: () => import('@/views/forum/ArticleList.vue'),
      }, {
        path: '/post/:articleId/',
        name: "Article Detail",
        component: () => import('@/views/forum/ArticleDetail.vue'),
      },{
        path: '/user/:userId',
        name: "user information",
        component: () => import('@/views/ucenter/Ucenter.vue'),
      }]
    }
  ]
})

export default router