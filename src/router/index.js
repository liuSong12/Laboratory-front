import { createRouter, createWebHashHistory } from "vue-router"
import routesItem from './config.js'
import { useRouterStore } from "../store/useRouterStore.js"
import { useUserStore } from "../store/useUserStore.js"


const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    // {
    //     path: '/mainbox',
    //     name: 'mainbox',
    //     component: () => import('../views/MainBox.vue')
    // }
]



const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const { isGetterRouter } = useRouterStore()
    const { user } = useUserStore()

    if (to.path === '/login') {
        next();
    } else {
        if (!user.role) {
            // 未登录
            next({
                path: 'login'
            });
        } else {
            // 已登录
            if (!isGetterRouter) {
                // remove mainbox route
                router.removeRoute("mainbox")
                configRoute()
                next({
                    path: to.fullPath
                })
            } else {
                next();
            }
        }
    }
});

function configRoute() {
    router.addRoute({
        path: "/mainbox",
        name: "mainbox",
        component: () => import('../views/MainBox.vue')
    })
    const { changeIsGetterRouter } = useRouterStore()
    routesItem.forEach(item => {
        checkPermission(item.path) && router.addRoute("mainbox", item)
    })

    // 重定向
    router.addRoute("mainbox", {
        path: "/",
        redirect: "/index"
    })

    // 404
    router.addRoute("mainbox", {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import('../views/notfound/NotFound.vue')
    })

    changeIsGetterRouter(true)
}

const checkPermission = (path) => {
    const { user } = useUserStore()
    return user.role.rights.includes(path)
}

export default router;

