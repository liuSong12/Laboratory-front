<template>
    <div class="formContainer">

        <h3>智慧实验室管理平台</h3>

        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="ruleForm" status-icon>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username" placeholder="3~6位" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" placeholder="6位以上" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">登录</el-button>
            </el-form-item>
        </el-form>

    </div>
    <!-- 配置particles -->
    <vue-particles id="tsparticles" :particlesInit="particlesInit" :options="config" />
</template>

<script setup>
import { useUserStore } from "../store/useUserStore"
import { useRouter } from "vue-router"
import { ref, reactive } from "vue"
import { config } from "../utils/config.js"
import axios from "axios"

//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "tsparticles-slim"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.

const particlesInit = async engine => {
    //await loadFull(engine);
    await loadSlim(engine);
};

// 表单验证
const ruleFormRef = ref(null)


const ruleForm = reactive({
    username: "",
    password: ""
})

const { changeUser } = useUserStore()

const router = useRouter()

// 提交表单
const submitForm = async () => {
    if (!ruleFormRef.value) return;
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            let res = await axios.post("/adminapi/users/login", ruleForm)
            const { code, data } = res.data
            if (code !== 0) return;
            changeUser(data)
            router.push("/")
        }
    })
}


const rules = reactive({
    username: [
        { required: true, message: 'Please input username', trigger: 'blur' },
        { min: 1, max: 5, message: 'Length should be 1 to 5', trigger: 'blur' }
    ],
    password: [
        {
            required: true,
            message: 'Please input passworwd',
            trigger: 'blur'
        },
        { min: 6, message: 'Length should ge 6', trigger: 'blur' }
    ]
})


</script>

<style scoped lang="scss">
.formContainer {
    width: 500px;
    height: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-shadow: 2px 2px 5px black;
    text-align: center;
    z-index: 9999;

    .ruleForm {
        margin-top: 50px;
    }

    h3 {
        font-size: 40px;
    }

    :deep(.el-form-item__label) {
        color: white;
        font-size: 16px;
        font-weight: 600;
    }
}</style>