import { createRouter, createWebHashHistory } from "vue-router"
import routesItem from './config.js'
import { useRouterStore } from "../store/useRouterStore.js"


const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/mainbox',
        name: 'mainbox',
        component: () => import('../views/MainBox.vue')
    }
]



const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const { isGetterRouter } = useRouterStore()

    if (to.path === '/login') {
        next();
    } else {
        let token = localStorage.getItem('token');
        if (token === null || token === '') {
            // 未登录
            next({
                path: 'login'
            });
        } else {
            // 已登录
            if (!isGetterRouter) {
                configRoute()
                next({
                    path: to.fullPath
                })
            }else{
                next();
            }
        }
    }
});

function configRoute() {
    const { changeIsGetterRouter } = useRouterStore()

    routesItem.forEach(item => {
        router.addRoute("mainbox", item)
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

export default router;

