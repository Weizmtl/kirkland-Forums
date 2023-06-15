import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies'
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/',
            component: () => import('@/views/Layout.vue'),
            redirect: "/forum/article",
            children: [{
                path: "/forum",
                name: "Content Management",
                children: [
                    {
                        path: "article",
                        name: "Article Management",
                        component: () => import('@/views/forum/ArticleList.vue'),
                    }, {
                        path: "comment",
                        name: "Comments Management",
                        component: () => import('@/views/forum/CommentList.vue')
                    }, {
                        path: "board",
                        name: "Board Management",
                        component: () => import('@/views/forum/BoardList.vue')
                    }
                ]
            }, {
                path: "/user",
                name: "User Management",
                children: [
                    {
                        path: "list",
                        name: "UserList",
                        component: () => import('@/views/user/UserList.vue'),
                    }
                ]
            }, {
                path: "/settings",
                name: "Settings",
                children: [
                    {
                        path: "sys",
                        name: "sys Settings",
                        component: () => import('@/views/settings/SysSettings.vue'),
                    }
                ]
            }]
        },
    ]
})

router.beforeEach((to, from, next) => {
    const userInfo = VueCookies.get("userInfo");
    if (!userInfo && to.path != "/login") {
        router.push("/login");
    }
    next();
})

export default router

