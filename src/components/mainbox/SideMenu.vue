<template>
    <div>
        <el-aside width="200px">
            <el-scrollbar>

                <el-menu :default-active="route.path" class="el-menu-vertical-demo" style="height: 100vh;" :router="true">

                    <FlatMenu :dataList="dataList" v-if="dataList.length"/>

                </el-menu>

            </el-scrollbar>
        </el-aside>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios"
import FlatMenu from './FlatMenu.vue'
import {useRoute} from "vue-router"

const dataList = ref([])

const route = useRoute()
console.log(route.path)
console.log(route.fullPath)

onMounted(() => {
    getList()
})

const getList = async () => {
    const res = await axios.get("/adminapi/rights")
    console.log(res.data)
    dataList.value = res.data
}


</script>