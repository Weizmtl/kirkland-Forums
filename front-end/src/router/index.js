import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store"
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
        path: '/newPost',
        name: "Post Article",
        component: () => import('@/views/forum/EditPost.vue'),
      },{
        path: '/editPost/:articleId',
        name: "Edit Article",
        component: () => import('@/views/forum/EditPost.vue'),
      },{
        path: '/user/:userId',
        name: "user information",
        component: () => import('@/views/ucenter/Ucenter.vue'),
      },{
        path: '/user/message/:type',
        name: "Message",
        component: () => import('@/views/ucenter/MessageList.vue'),
      }]
    },
    {
      path: "/:pathMatch(.*)*",
      name: "ErrorPage",
      component: () => import("@/views/Error404.vue")
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path.indexOf("/user") != -1) {
    store.commit("setActivePboardId", -1);
  }
  next();
})
export default router