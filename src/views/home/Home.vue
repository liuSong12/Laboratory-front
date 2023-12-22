<template>
    <div>

        上传视频---大文件分片上传
        <el-upload class="avatar-uploader" action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
            <el-icon class="avatar-uploader-icon">
                <Plus />
            </el-icon>
        </el-upload>
        <div>上传进度：<span ref="uploadProcess">0%</span></div>


    </div>
</template>


<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'

const thunckSize = 1024 * 1024 * 5
// const imageUrl = ref('')
const uploadProcess = ref(null)
let fileName;
const handleAvatarSuccess = (response, uploadFile) => {
    // imageUrl.value = URL.createObjectURL(uploadFile.raw)
}

const beforeAvatarUpload = async (rawFile) => {
    if (!rawFile) {
        ElMessage.error('Please select a file!')
        return false
    }
    if (!rawFile.type.includes('video')) {
        ElMessage.error('Please select a video!')
        return false
    }

    let num = 3;
    let hash;
    let needUpload = true
    async function upload(num) {
        if (num === 0) {
            return false;
        }
        fileName = rawFile.name
        //文件片段
        let fileChunks = fileSlice(rawFile)
        //计算hash
        hash = await getHash(fileChunks)
        let vrifyRes = await axios.post('/adminapi/verify', {
            fileHash: hash,
            extend: fileName.substring(fileName.lastIndexOf("."))
        })
        if (vrifyRes.data.code !== 0) return false;
        const { alreadyUploadItem, needUpload } = vrifyRes.data.data
        if (!needUpload) {
            ElMessage.success('秒传成功')
            needUpload = false
            return true
        };
        //获取请求formdata
        let formDataArr = getFormDataArr(fileChunks, hash, alreadyUploadItem)
        let result = await concurRequest(formDataArr, 6)
        for (let index = 0; index < result.length; index++) {
            if (result[index].code !== 0) {
                num--;
                ElMessage.error('请勿操作，正在尝试重新上传')
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve()
                    }, 1000);
                })
                return await upload(num)     
            };
        }
        return true
    }

    let result = await upload(num)
    if (!result) {
        ElMessage.error('稍后再试')
        return false
    }
    if(!needUpload) return false;

    //分片合并
    let mergeRes = await mergeFile(hash)
    if (mergeRes.data.code !== 0) return false;
    ElMessage.success('上传成功')
    return false


}

function mergeFile(hash) {
    return axios.post('/adminapi/merge', {
        fileHash: hash,
        fileName
    })
}

function concurRequest(formdataArr, maxNum) {
    maxNum = Math.min(maxNum, formdataArr.length)
    return new Promise((resolve, reject) => {
        if (maxNum <= 0) {
            resolve([])
        }
        let index = 0; //下一次请求下标
        let count = 0;
        let result = []
        async function request() {
            let i = index;
            let formdata = formdataArr[index]
            index++;
            try {
                let resp = await axios.post('/adminapi/upload', formdata)
                result[i] = resp.data
            } catch (err) {
                result[i] = err
            } finally {
                count++;
                let process = (count / formdataArr.length * 100).toFixed(2) + "%"
                console.log(process)
                console.log(uploadProcess.value)
                uploadProcess.value.innerHTML = process
                // console.log((count / formdataArr.length * 100).toFixed(2) + "%")
                if (count === formdataArr.length) {
                    resolve(result)
                }
                if (index < formdataArr.length) {
                    request()
                }
            }
        }
        for (let i = 0; i < maxNum; i++) {
            request()
        }
    })
}

function getFormDataArr(chunksArr, hash, alreadyUploadItem) {
    if (!alreadyUploadItem) {
        alreadyUploadItem = []
    }
    return chunksArr
        .map((chunk, index) => {
            let formData = new FormData()
            formData.append('fileChunk', chunk)
            formData.append('fileHash', hash)
            formData.append('chunkIndex', hash + "-" + index)
            formData.append('fileName', fileName)
            return formData;
        }).filter(item => {
            return !alreadyUploadItem.includes(item.get('chunkIndex'))
        })
}

//计算hash
function getHash(fileChunks) {
    return new Promise((resolve, reject) => {
        const targets = []
        for (let i = 0; i < fileChunks.length; i++) {
            if (i === 0 || i === fileChunks.length - 1) {
                targets.push(fileChunks[i])
            } else {
                targets.push(fileChunks[i].slice(0, 2)) //前面两个字节
                let middle = Math.floor(fileChunks[i].size / 2)
                targets.push(fileChunks[i].slice(middle, middle + 2)) //中间两个字节
                targets.push(fileChunks[i].slice(-2)) //后面两个字节
            }
        }
        let newFile = new Blob(targets)
        const reader = new FileReader()
        reader.readAsArrayBuffer(newFile)
        reader.onload = async () => {
            const sha1 = await crypto.subtle.digest('SHA-1', new Uint8Array(reader.result))
            let hash = Array.from(new Uint8Array(sha1)).map(item => {
                return item.toString(16).padStart(2, '0')
            }).join("")
            resolve(hash)
        }
        reader.onerror = (error) => {
            reject(error)
        }
    })
}


function fileSlice(file) {
    let fileChunks = []
    let cur = 0
    while (cur < file.size) {
        const blob = file.slice(cur, cur + thunckSize)
        fileChunks.push(blob)
        cur += thunckSize
    }
    return fileChunks
}


</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
