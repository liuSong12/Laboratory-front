<template>
    <div>
        <el-aside width="200px">
            <el-scrollbar>

                <el-menu :default-active="route.path" class="el-menu-vertical-demo" style="height: 100vh;" :router="true">

                    <FlatMenu :dataList="rightsStore.rightsList" v-if="rightsStore.rightsList.length" />

                </el-menu>

            </el-scrollbar>
        </el-aside>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios"
import FlatMenu from './FlatMenu.vue' 
import { useRoute } from "vue-router"
import { useRightsStore } from "../../store/useRightsStore"

const rightsStore = useRightsStore()

const route = useRoute()


onMounted(() => {
    rightsStore.rightsList.length === 0 && getList()
})

const getList = async () => {
    const res = await axios.get("/adminapi/rights")
    rightsStore.changeRights(res.data.data) 
}


</script>