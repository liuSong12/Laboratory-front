<template>
    <div>

        <el-table :data="labList" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>

            <el-table-column prop="labName" label="实验室名称" sortable>
                <template #default="scope">
                    <el-link @click="handleLabDetail(scope.row)">{{ scope.row.labName }}</el-link>
                </template>
            </el-table-column>


            <el-table-column prop="labCollegeName" :filters="labCollegeList" :filter-method="filterHandler" label="所属学院"
                sortable>
                <template #default="scope">
                    <el-tag effect="dark" :type="colors.collegeTypeColor[scope.row.labCollegeName]">{{
                        scope.row.labCollegeName
                    }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="labTypeName" :filters="labTypeList" :filter-method="filterHandler" label="实验室类型"
                sortable>
                <template #default="scope">
                    <el-tag effect="plain" :type="colors.labTypeColor[scope.row.labTypeName]">{{ scope.row.labTypeName
                    }}</el-tag>
                </template>
            </el-table-column>


            <el-table-column prop="capacity" label="容纳人数" sortable />
            <el-table-column label="操作" width="250">
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

        <LabForm ref="labFormRef" title="编辑实验室" confirm="修改" @getLabList="getLabList"/>



        <el-dialog :model-value="dialogVisible" :fullscreen="true" width="30%" @close="dialogVisible = false">
            <template #header>
                <span>实验室位置</span>
            </template>
            <div style="height: 100%;">
                <AddLab :lat="zoomPosition.lng" :lng="zoomPosition.lat" :zoom="18" v-if="dialogVisible" />
            </div>
        </el-dialog>



    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import axios from 'axios'
import AddLab from '../../components/lab-manage/LabMap.vue'
import LabForm from '../../components/lab-manage/LabForm.vue'

const labFormRef = ref(null)
const labList = ref([])
const dialogVisible = ref(false)
const colors = reactive({
    labTypeColor: null,
    collegeTypeColor: null
})
// 放大坐标
const zoomPosition = reactive({
    lat: 0,
    lng: 0
})


let colorType = ['', 'success', 'info', 'danger', 'warning']
// 打乱数组顺序
function shuffle(arr) {
    let len = arr.length
    for (let i = 0; i < len; i++) {
        let random = Math.floor(Math.random() * len)
        let temp = arr[i]
        arr[i] = arr[random]
        arr[random] = temp
    }
    return arr
}
colorType = shuffle(colorType)


onMounted(() => {
    getLabList()
    setTimeout(() => {
        let btn = document.querySelectorAll(".el-table-filter__bottom")
        btn.forEach((dom) => {
            dom.children[0].innerHTML = '过滤'
            dom.children[1].innerHTML = '重置'
        })
    }, 1000)
})

const handleLabDetail = (row) => {
    zoomPosition.lat = row.lat
    zoomPosition.lng = row.lng
    dialogVisible.value = true
}


const labCollegeList = computed(() => {
    let newArrList = []
    labList.value.forEach(item => {
        let labCollegeName = item.labCollegeName
        let flag = false
        for (let index = 0; index < newArrList.length; index++) {
            if (newArrList[index].text === labCollegeName) {
                flag = true
                break;
            }
        }
        if (!flag) {
            newArrList.push({
                text: labCollegeName,
                value: labCollegeName
            })
        }
    })
    return newArrList
})

const labTypeList = computed(() => {
    let newArrList = []
    labList.value.forEach(item => {
        let labTypeName = item.labTypeName
        let flag = false
        for (let index = 0; index < newArrList.length; index++) {
            if (newArrList[index].text === labTypeName) {
                flag = true
                break;
            }
        }
        if (!flag) {
            newArrList.push({
                text: labTypeName,
                value: labTypeName
            })
        }
    })
    return newArrList
})




const filterHandler = (value, row, column) => {
    const property = column['property']
    return row[property] === value
}

const handleEdit = (index, row) => {
    const {labName,capacity,labId,collegeId,id} = row
    labFormRef.value.changeLabForm(labName,capacity,labId,collegeId,id)
    labFormRef.value.showDialog()
}

const handleConfirm = async (row) => {
    let res = await axios.delete(`/adminapi/labs/${row.id}`)
    if (res.data.code !== 0) return;
    getLabList()
}

const getLabList = async () => {
    let res = await axios.get("/adminapi/labs/getPoints")
    if (res.data.code !== 0) return;
    labList.value = res.data.data
    let labTypeColor = {}
    let collegeTypeColor = {}
    let newTypeArr = colorType.concat()
    let newCollegeArr = colorType.concat()
    res.data.data.forEach(item => {
        if (!labTypeColor[item.labTypeName]) {
            if (newTypeArr.length === 0) {
                newTypeArr = colorType.concat()
            }
            labTypeColor[item.labTypeName] = newTypeArr.pop()
        }
        if (!collegeTypeColor[item.labCollegeName]) {
            if (newCollegeArr.length === 0) {
                newCollegeArr = colorType.concat()
            }
            collegeTypeColor[item.labCollegeName] = newCollegeArr.pop()
        }
    })
    colors.labTypeColor = labTypeColor
    colors.collegeTypeColor = collegeTypeColor
}

</script>

<style scoped>
:deep(.el-dialog__body) {
    height: 100%;
}
</style>