<template>
    <template v-for="data in props.dataList" :key="data.path">
        <el-sub-menu :index="data.path" v-if="data.children && data.children.length && checkAuth(data.path)">
            <template #title>
                <el-icon>
                    <component :is="mapIcon[data.icon]" />
                </el-icon>
                <span>{{ data.title }}</span>
            </template>
            <el-menu-item-group>
                <FlatMenu :dataList="data.children" />
            </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item :index="data.path" v-else-if="checkAuth(data.path)">
            <el-icon>
                <component :is="mapIcon[data.icon]" />
            </el-icon>
            <span>{{ data.title }}</span>
        </el-menu-item>
    </template>
</template>


<script setup>
import { defineProps } from "vue"
import { HomeFilled, User, List, Key, OfficeBuilding, UploadFilled } from '@element-plus/icons-vue'
import FlatMenu from './FlatMenu.vue'
import { useUserStore } from "../../store/useUserStore"


const props = defineProps({
    dataList: {
        type: Array,
        default: []
    }
})



const mapIcon = { User, HomeFilled, List, Key, OfficeBuilding, UploadFilled }

const userStore = useUserStore()
const checkAuth = (path) => {
    return userStore.user.role && userStore.user.role.rights.includes(path)
}




</script>