<template>
    <div>
        <el-button type="primary" style="margin-bottom: 20px;" @click="handleClick">添加用户</el-button>
        <el-table :data="userList" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>

            <el-table-column prop="roleName" label="角色名称" sortable>
                <template #default="scope">
                    <div>{{ scope.row.role.roleName }}</div>
                </template>
            </el-table-column>

            <el-table-column prop="username" label="用户名" sortable />


            <el-table-column label="操作" width="250">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                        :disabled="scope.row.isDefault === 1">编辑</el-button>
                    <el-popconfirm title="确认删除?" @confirm="handleConfirm(scope.row)">
                        <template #reference>
                            <el-button size="small" type="danger" :disabled="scope.row.isDefault === 1">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>

        </el-table>

        <UserDialog :dialogVisible="dialogVisible" @hiddenVisible="hiddenVisible"  :currentRow="currentRow" @getUserList="getUserList" />

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import UserDialog from "../../components/userform/Dialog.vue"

const dialogVisible = ref(false)
const currentRow = ref(null)
const userList = ref([])


onMounted(() => {
    getUserList()
})


const hiddenVisible = () => {
    dialogVisible.value = false
}

const handleEdit = (index, row) => {
    currentRow.value = row
    dialogVisible.value = true
}
const handleConfirm = async (row) => {
    const res = await axios.delete(`/adminapi/users/${row.id}`)
    if (res.data.code !== 0) return;
    await getUserList()
}


const getUserList = () => {
    return axios.get('/adminapi/users').then(res => {
        userList.value = res.data.data
    })
}


const handleClick = () => {
    currentRow.value = null
    dialogVisible.value = true
}


</script>

<style >
.is-penultimate>.el-tree-node__content {
    color: red;
}
</style>