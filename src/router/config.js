const routes = [
    {
        path:"/index",
        component: () => import('../views/home/Home.vue')
    },
    {
        path:"/user-manage/list",
        component: () => import('../views/user/UserList.vue')
    },
    {
        path:"/right-manage/rolelist",
        component: () => import('../views/right-manage/RoleList.vue')
    },
    {
        path:"/right-manage/rightlist",
        component: () => import('../views/right-manage/RightList.vue')
    },
    {
        path:"/lab-manage/lablist",
        component: () => import('../views/lab-manage/LabList.vue')
    },
    {
        path:"/lab-manage/addlab",
        component: () => import('../views/lab-manage/AddLab.vue')
    },
    {
        path:"/book-manage/auditlist",
        component: () => import('../views/book-manage/AuditList.vue')
    },
    {
        path:"/book-manage/booklist",
        component: () => import('../views/book-manage/BookList.vue')
    },
    {
        path:"/book-manage/addbook",
        component: () => import('../views/book-manage/AddBook.vue')
    }
]

export default routes;