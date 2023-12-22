<template>
    <div>
        <el-header class="header-container">
            <div>
                <div class="header-left">
                    <div style="min-width: 200px;">实验室管理系统</div>
                    <div style="transform: translateX(-240px) scale(0.145);">
                        <SwithButton />
                    </div>
                </div>
            </div>
            <div>
                <span class="welcome">欢迎 {{ user.username }} 回来</span>
                <el-dropdown>
                    <el-avatar :size="50" src="/avatar.png" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>
                                {{ user.role.roleName }}
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-button type="danger" @click="handleLogout">退出</el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-header>
    </div>
</template>

<script setup>

import { useRouter } from "vue-router"
import { useUserStore } from "../../store/useUserStore"
import { useRouterStore } from "../../store/useRouterStore"
import SwithButton from "../swithbotton/SwithButton.vue"

//拿assets地址
// vite:
// const assetsUrl = import.meta.url
// const url = new URL("../../assets/avatar.png", assetsUrl).href
// console.log(assetsUrl,"====", url)

//webpack:
// const url = require("../../assets/avatar.png")
// console.log(url)


const { changeIsGetterRouter } = useRouterStore()
const { changeUser, user } = useUserStore()
const router = useRouter()
const handleLogout = () => {
    changeUser({})
    changeIsGetterRouter(false)
    router.push("/login")
}
</script>


<style scoped lang="scss">
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    // background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    font-size: 25px;
    font-weight: 400;
    text-shadow: 0 0 3px #b3b3b3;

    .header-left {
        width: 300px;
        height: 50px;
        display: flex;
        align-items: center;
    }
}

.welcome {
    font-size: 15px;
    line-height: 50px;
    margin-right: 20px;
}
</style>