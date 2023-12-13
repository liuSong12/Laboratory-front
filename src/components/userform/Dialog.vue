<template>
    <el-dialog :model-value="props.dialogVisible" width="30%" @close="hiddenVisible">
        <template #header>
            <span>添加用户</span>
        </template>
        <div>
            <el-form :model="userForm" ref="userFormRef" :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" style="margin-left: 13px;">
                    <el-input v-model="userForm.password"></el-input>
                </el-form-item>
                <el-form-item label="用户身份" prop="roleId">
                    <el-checkbox-group v-model="userForm.roleId" :max="1">
                        <el-checkbox :label="item.roleName" name="roleId" v-for="item in roleList" :key="item.id">
                            <el-popover placement="bottom" title="拥有权限" :width="200" trigger="hover" @show="showPop(item)">
                                <template #reference>
                                    <el-button class="m-2"
                                        style="--el-button-hover-bg-color:white; padding: 0 !important; border: 0; ">{{
                                            item.roleName }}</el-button>
                                </template>
                                <template #default>
                                    <el-tree :data="rightsList" :props="defaultProps" :default-expand-all="true" />
                                </template>
                            </el-popover>
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="hiddenVisible">取消</el-button>
                <el-button type="primary" @click="handleUpdate()">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, defineEmits, onMounted, watch } from 'vue';
import axios from 'axios';
import {ElMessage} from "element-plus"


const currentItem = ref([])
const userFormRef = ref(null)
const rightsList = ref([])
const roleList = ref([])

const emits = defineEmits(["hiddenVisible", "getUserList"])


onMounted(() => {
    getRightsList()
    getRoleList()
})

const getRoleList = async () => {
    const res = await axios.get('/adminapi/roles')
    roleList.value = res.data.data
}
const getRightsList = async () => {
    const res = await axios.get('/adminapi/rights')
    rightsList.value = res.data.data
}

const props = defineProps({
    dialogVisible: {
        default: false,
        type: Boolean
    },
    currentRow: {
        default: null,
        type: Object
    }
})


const userForm = reactive({
    username: '',
    password: '',
    roleId: []
})

watch(() => props.currentRow, (newValue) => {
    if (newValue !== null) {
        let { username } = props.currentRow
        let { roleName } = props.currentRow.role
        userForm.username = username
        userForm.roleId = [roleName]
    } else {
        userForm.username = ''
        userForm.password = ''
        userForm.roleId = []
    }
})


const hiddenVisible = () => {
    emits("hiddenVisible")
}

const rules = reactive({
    username: [
        { required: true, message: '请输入角色名称' }
    ],
    password: [
        { required: true, message: '请输入用户密码' }
    ],
    roleId: [
        { type: 'array', required: true, message: '请输入用户身份' }
    ]
})

const showPop = (item) => {
    currentItem.value = JSON.parse(item.rights)
}

const handleUpdate = () => {
    userFormRef.value.validate(async valid => {
        if (!valid) return;
        let roleId = getRoleId()
        if (!roleId) return;
        let res;
        let requestBody = {
            username: userForm.username,
            password: userForm.password,
            roleId
        }
        if (props.currentRow !== null) {
            //这里是修改
            res = await axios.put(`/adminapi/users/${props.currentRow.id}`, requestBody)
        } else {
            //这里是添加
            res = await axios.post('/adminapi/users', requestBody)
        }
        if (res.data.code !== 0) return;
        ElMessage({
            message: res.data.msg,
            type: 'success',
        })
        emits("getUserList")
        emits("hiddenVisible")
    })

}





const customNodeClass = (data, node) => {
    if (currentItem.value && currentItem.value.includes(data.path)) {
        return null
    }
    return 'is-penultimate'
}

function getRoleId() {
    let roleMap = {}
    let roleArr = roleList.value.map(item => {
        return {
            [item.roleName]: item.roleType
        }
    })
    roleArr.forEach(item => {
        Object.assign(roleMap, item)
    })
    return roleMap[userForm.roleId]
}

const defaultProps = {
    children: 'children',
    label: 'title',
    class: customNodeClass
}

</script>