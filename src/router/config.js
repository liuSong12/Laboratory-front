const routes = [
    {
        path:"/index",
        name:"/index",
        component: () => import('../views/home/Home.vue')
    },
    {
        path:"/user-manage/list",
        name:"/user-manage/list",
        component: () => import('../views/user/UserList.vue')
    },
    {
        path:"/right-manage/rolelist",
        name:"/right-manage/rolelist",
        component: () => import('../views/right-manage/RoleList.vue')
    },
    {
        path:"/right-manage/rightlist",
        name:"/right-manage/rightlist",
        component: () => import('../views/right-manage/RightList.vue')
    },
    {
        path:"/lab-manage/lablist",
        name:"/lab-manage/lablist",
        component: () => import('../views/lab-manage/LabList.vue')
    },
    {
        path:"/lab-manage/addlab",
        name:"/lab-manage/addlab",
        component: () => import('../views/lab-manage/AddLab.vue')
    },
    {
        path:"/book-manage/auditlist",
        name:"/book-manage/auditlist",
        component: () => import('../views/book-manage/AuditList.vue')
    },
    {
        path:"/book-manage/booklist",
        name:"/book-manage/booklist",
        component: () => import('../views/book-manage/BookList.vue')
    },
    {
        path:"/book-manage/addbook",
        name:"/book-manage/addbook",
        component: () => import('../views/book-manage/AddBook.vue')
    }
]

export default routes;