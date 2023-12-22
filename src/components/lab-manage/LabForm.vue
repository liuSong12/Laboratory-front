<template>
    <el-dialog :model-value="dialogVisible" width="30%" @close="dialogVisible = false">
        <template #header>
            <span>{{ props.title }}</span>
        </template>
        <div>
            <el-form :model="labForm" ref="labFormRef" :rules="rules" label-width="100px">
                <el-form-item label="实验室名称" prop="labName">
                    <el-input v-model="labForm.labName"></el-input>
                </el-form-item>
                <el-form-item label="容纳人数" prop="capacity">
                    <el-input-number size="small" v-model="labForm.capacity" :min="15"></el-input-number>
                </el-form-item>
                <el-form-item label="实验室类型" prop="labId">
                    <el-select v-model="labForm.labId" placeholder="请选择实验室类型" style="width: 100%;">
                        <el-option v-for="item in labAndCollegeList.labTypeNameList" :key="item.id"
                            :label="item.labTypeName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属学院" prop="collegeId">
                    <el-select v-model="labForm.collegeId" placeholder="请选择实验室所属学院" style="width: 100%;">
                        <el-option v-for="item in labAndCollegeList.labCollegeNameList" :key="item.id"
                            :label="item.labCollegeName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleAddLab">
                    确认{{ props.confirm }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, ref, reactive, defineExpose } from "vue"
import axios from "axios"

const emits = defineEmits(["initOringinPoint","getLabList"])
const props = defineProps({
    title: {
        type: String,
        default: '添加实验室'

    },
    confirm: {
        type: String,
        default: '添加'
    }
})

const dialogVisible = ref(false)
const labFormRef = ref(null)
const labAndCollegeList = ref({})
const labForm = reactive({
    id: '',
    labName: '',
    capacity: 0,
    labId: '',
    collegeId: '',
    lat: 0,
    lng: 0
})

const changeLabForm = (labName, capacity, labId, collegeId, id) => {
    labForm.labName = labName
    labForm.capacity = capacity
    labForm.labId = labId
    labForm.collegeId = collegeId
    labForm.id = id
}


const setLatLng = (lat, lng) => {
    labForm.lat = lat
    labForm.lng = lng
}
const showDialog = () => {
    dialogVisible.value = true
}
defineExpose({
    showDialog,
    setLatLng,
    changeLabForm
})

const rules = reactive({
    labName: [
        { required: true, message: '请输入实验室名称', trigger: 'blur' }
    ],
    capacity: [
        { required: true, message: '请输入实验室容纳人数', trigger: 'blur' }
    ],
    labId: [
        { required: true, message: '请输入实验室类型', trigger: 'blur' }
    ],
    collegeId: [
        { required: true, message: '请选择实验室所属学院', trigger: 'blur' }
    ]
})


//添加标注
const handleAddLab = () => {
    labFormRef.value.validate(async valid => {
        if (!valid) return;
        let res;
        if (props.confirm === '修改') {
            res = await axios.put(`/adminapi/labs`, labForm)
            if (res.data.code !== 0) return;
            emits("getLabList")
        } else if (props.confirm === '添加') {
            res = await axios.post("/adminapi/labs", labForm)
            if (res.data.code !== 0) return;
            emits("initOringinPoint")
        }
        dialogVisible.value = false

    })
}



onMounted(() => {
    getType()
})

const getType = async () => {
    let res = await axios.get("/adminapi/labs")
    if (res.data.code !== 0) return;
    labAndCollegeList.value = res.data.data
}



</script>

