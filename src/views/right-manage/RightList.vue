<template>
    <div>

        <el-table :data="rightsStore.rightsList" style="width: 100%; margin-bottom: 20px" row-key="id" border
            default-expand-all>
            <el-table-column prop="title" label="权限名称" sortable />
            <el-table-column label="图标">
                <template #default="scope">
                    <el-icon size="20">
                        <component :is="mapIcon[scope.row.icon]"></component>
                    </el-icon>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-popconfirm title="确认删除?" @confirm="handleConfirm(scope.row)">
                        <template #reference>
                            <el-button size="small" type="danger">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog v-model="dialogVisible" title="Tips" width="30%">
            <template #header>
                <span>编辑权限信息</span>
            </template>
            <div>
                <el-form :model="updateForm" ref="rightFormRef" :rules="rules">
                    <el-form-item label="权限名称" prop="title">
                        <el-input v-model="updateForm.title"></el-input>
                    </el-form-item>
                    <el-form-item label="权限图标" prop="icon">
                        <el-checkbox-group v-model="updateForm.icon">
                            <el-checkbox :label="item" :name="item" v-for="item in Object.keys(mapIcon)"></el-checkbox>
                        </el-checkbox-group>
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
import { onMounted, ref, reactive, watch } from "vue";
import axios from "axios"
import { HomeFilled, User, List, Key, OfficeBuilding, UploadFilled } from '@element-plus/icons-vue'
import { useRightsStore } from "../../store/useRightsStore"
import router from "../../router/index"

const rightsStore = useRightsStore()

const rightFormRef = ref(null)
const dialogVisible = ref(false)
const selectId = ref(null)

const mapIcon = { User, HomeFilled, List, Key, OfficeBuilding, UploadFilled }

const updateForm = reactive({
    title: "",
    icon: []
})

watch(() => updateForm.icon, (newVal, oldVal) => {
    if (oldVal.length === 0) return;
    updateForm.icon = newVal.splice(newVal.length - 1, 1)
})

const rules = reactive({
    title: [
        { required: true, message: '请输入权限名称', trigger: 'blur' },
    ],
    icon: [
        { required: true, message: '请输入权限图标', trigger: 'blur' },
    ]
})


function removeRights(arr, id) {
    //递归找出父级和子级中符合条件的数据
    let newArr = arr.filter(item => {
        if (item.id === id) {
            return false
        }
        if (item.children) {
            item.children = removeRights(item.children, id)
        }
        return true
    })
    return newArr
}

function removeRoute(arr, path) {
    arr.forEach(element => {
        if (element.path === path) {
            if(element.children && element.children.length > 0){
                element.children.forEach(item => {
                    router.removeRoute(item.path)
                })
                removeRoute(element.children, path)
            }else{
                router.removeRoute(element.path)
            }
        }
        if (element.children) {
            removeRoute(element.children, path)
        }
    });
}

const handleConfirm = (row) => {
    axios.delete(`/adminapi/rights/${row.id}`).then(res => {
        if (res.data.code !== 0) return;
        //删除路由中的数据
        removeRoute(rightsStore.rightsList, row.path)

        //删除菜单和权限列表中的数据
        let newRightArr = removeRights(rightsStore.rightsList, row.id)
        rightsStore.changeRights(newRightArr)

    })
}

const handleUpdate = () => {
    rightFormRef.value.validate(async valid => {
        if (valid) {
            const res = await axios.put(`/adminapi/rights/${selectId.value}`, {
                title: updateForm.title,
                icon: updateForm.icon[0]
            })

            if (res.data.code !== 0) return;

            let newRightArr = rightsStore.rightsList.map(item => {
                if (item.id === selectId.value) {
                    item.title = updateForm.title
                    item.icon = updateForm.icon[0]
                }
                return item
            })
            rightsStore.changeRights(newRightArr)
            dialogVisible.value = false
        }
    })
}





const handleEdit = (index, row) => {
    dialogVisible.value = true
    updateForm.title = row.title
    updateForm.icon = [row.icon]
    selectId.value = row.id
}


const getList = async () => {
    const res = await axios.get("/adminapi/rights")
    rightsStore.changeRights(res.data.data)
}

onMounted(() => {
    rightsStore.rightsList.length === 0 && getList()
})

</script>


<style scoped>
:deep(.el-table_1_column_2) {
    text-align: center;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}
</style>