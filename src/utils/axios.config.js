// axios config
import { ElMessage } from 'element-plus'
import axios from 'axios';

//监听网络错误
axios.defaults.timeout = 5000;

//错误响应码
let errResponseCode = ["ERR_NETWORK", "ECONNABORTED"];

//网速信息
// console.log(navigator.connection)
//离线在线监测
//console.log(navigator.onLine)//true在线，false离线

window.addEventListener("online", () => {
    //网络监测
    const { downlink, rtt } = navigator.connection //下载速度MB/s， 延迟ms
    ElMessage({
        message: `网络恢复：网速：${downlink}Mb/s,延迟：${rtt}ms`,
        type: 'success',
    })
})

window.addEventListener("offline", () => {
    //网络监测
    const { downlink, rtt } = navigator.connection //下载速度MB/s， 延迟ms
    ElMessage({
        message: `网络断开：网速：${downlink}Mb/s,延迟：${rtt}ms`,
        type: 'error',
    })
})

navigator.connection.addEventListener("change", () => {
    const { effectiveType,downlink, rtt, } = navigator.connection //下载速度MB/s， 延迟ms
    if(downlink<0.4){
        ElMessage({
            message: `网速低：网络：${effectiveType},网速：${downlink}Mb/s,延迟：${rtt}ms`,
            type: 'warn'
        })
    }
})



axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data.code === 2) {
        ElMessage({
            message: '出错了:' + response.data.msg,
            type: 'error',
        })
    }
    return response;
}, function (error) {
    if (errResponseCode.includes(error.code)) {
        ElMessage({
            message: error.message,
            type: 'error',
        })
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

