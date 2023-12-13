<template>
    <div>
        <el-table :data="roleList" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>

            <el-table-column prop="roleName" label="角色名称" sortable>
                <template #default="scope">
                    <el-popover placement="right" title="拥有权限" :width="200" trigger="hover" @show="popShow(scope.row)">
                        <template #reference>
                            <el-button class="m-2">{{ scope.row.roleName }}</el-button>
                        </template>
                        <template #default>
                            <el-tree :data="rightsList" :props="defaultProps" :default-expand-all="true" />
                        </template>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="250">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-popconfirm title="确认删除?" @confirm="handleConfirm(scope.row)">
                        <template #reference>
                            <el-button size="small" type="danger"
                                :disabled="scope.row.id === userStore.user.id || scope.row.roleType === 1">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>

        </el-table>


        <el-dialog v-model="dialogVisible" width="30%">
            <template #header>
                <span>编辑角色信息</span>
            </template>
            <div>
                <el-form :model="updateForm" ref="rightFormRef" :rules="rules">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="updateForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="权限">
                        <el-tree :data="rightsList" show-checkbox node-key="path" :default-expand-all="true" ref="treeRef" v-if="dialogVisible"
                            check-strictly :props="{
                                children: 'children',
                                label: 'title',
                                disabled: selectRow.roleType === 1 ? 'path' : ''
                            }" />
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleUpdate()">
                        确认
                    </el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>


<script setup>
import axios from 'axios'
import { onMounted, ref, reactive, nextTick } from 'vue';
import { useUserStore } from "../../store/useUserStore"
import { useRouterStore } from "../../store/useRouterStore"

const userStore = useUserStore()
const routerStore = useRouterStore()
const roleList = ref([])
const rightsList = ref([])
const currentRow = ref(null)
const dialogVisible = ref(false)
const rightFormRef = ref(null)
const treeRef = ref(null)
const selectRow = ref(null)



const updateForm = reactive({
    roleName: ""
})


onMounted(() => {
    getRoleList()
    getRightsList()
})
const customNodeClass = (data, node) => {
    if (currentRow.value && JSON.parse(currentRow.value.rights).includes(data.path)) {
        return null
    }
    return 'is-penultimate'
}
const popShow = (row) => {
    currentRow.value = row
}

const handleEdit = (index, row) => {
    dialogVisible.value = true
    selectRow.value = row
    updateForm.roleName = row.roleName
    nextTick(() => {
        let rights = JSON.parse(row.rights)
        treeRef.value.setCheckedKeys(rights)
    })
}

const rules = reactive({
    roleName: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
    ]
})



const getRoleList = async () => {
    const res = await axios.get('/adminapi/roles')
    roleList.value = res.data.data
}
const getRightsList = async () => {
    const res = await axios.get('/adminapi/rights')
    rightsList.value = res.data.data
}
const defaultProps = {
    children: 'children',
    label: 'title',
    class: customNodeClass
}
const handleConfirm = (row) => {
    if (userStore.user.role.roleType === selectRow.value.roleType) return;
    axios.delete(`/adminapi/roles/${row.id}`).then(res => {
        if (res.data.code !== 0) return;
        //删除table中的数据
        roleList.value = roleList.value.filter(item => item.id !== selectRow.value.id)
    })
}

const handleUpdate = () => {
    rightFormRef.value.validate(async valid => {
        if (valid) {
            let checkedKey = treeRef.value.getCheckedKeys()
            const res = await axios.put(`/adminapi/roles/${selectRow.value.id}`, {
                roleName: updateForm.roleName,
                rights: JSON.stringify(checkedKey)
            })
            if (res.data.code !== 0) return;
            //更新table信息
            updateTable(checkedKey)
            //更新user信息
            updateUser(checkedKey)
            dialogVisible.value = false
        }
    })
}

const updateTable = (checkedKey) => {
    let newRightsArr = roleList.value.map(item => {
        if (item.id === selectRow.value.id) {
            return {
                ...item,
                roleName: updateForm.roleName,
                rights: JSON.stringify(checkedKey)
            }
        }
        return item
    })
    roleList.value = newRightsArr
}


const updateUser = (checkedKey) => {
    if (userStore.user.role.roleType !== selectRow.value.roleType) return;
    routerStore.changeIsGetterRouter(false)
    userStore.changeUser({
        ...userStore.user,
        role: {
            ...userStore.user.role,
            rights: checkedKey
        }
    })
}

</script>

<style >
.is-penultimate>.el-tree-node__content {
    color: red;
}
</style>