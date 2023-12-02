<template>
    <div>
        <div class="common-layout">
            <el-container style="height: 100vh;">
                <SideMenu />
                <el-container direction="vertical">
                    <TopHeader />
                    <el-main style="padding-right: 0;">
                        <el-scrollbar>
                            <router-view></router-view>
                        </el-scrollbar>
                    </el-main>
                </el-container>
            </el-container>
        </div>
        <!-- <button @click="handleLogout">退出</button> -->
    </div>
</template>


<script setup>
import SideMenu from "../components/mainbox/SideMenu.vue"
import TopHeader from "../components/mainbox/TopHeader.vue"


</script>