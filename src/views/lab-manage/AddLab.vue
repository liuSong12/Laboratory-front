<template>
  <div style="height:100%;">

    <div style="height:100%; justify-content: center;position: relative" id="map"></div>

    <el-dialog :model-value="dialogVisible" width="30%" @close="dialogVisible = false">
      <template #header>
        <span>添加实验室</span>
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
              <el-option v-for="item in labAndCollegeList.labTypeNameList" :key="item.id" :label="item.labTypeName"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属学院" prop="collegeId">
            <el-select v-model="labForm.collegeId" placeholder="请选择实验室所属学院" style="width: 100%;">
              <el-option v-for="item in labAndCollegeList.labCollegeNameList" :key="item.id" :label="item.labCollegeName"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddLab">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import { Scene, Popup, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { onMounted, ref, reactive } from "vue"
import axios from "axios"

const dialogVisible = ref(false)
const labFormRef = ref(null)
const labAndCollegeList = ref({})


const labForm = reactive({
  labName: '',
  capacity: 0,
  labId: '',
  collegeId: '',
  lat: 0,
  lng: 0
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

const handleAddLab = () => {
  labFormRef.value.validate(async valid => {
    if (!valid) return;
    let res = await axios.post("/adminapi/labs", labForm)
    if (res.data.code !== 0) return;
    initOringinPoint()
    dialogVisible.value = false

  })
}

onMounted(() => {
  initMap()
  getType()
})

const getType = async () => {
  let res = await axios.get("/adminapi/labs")
  if (res.data.code !== 0) return;
  labAndCollegeList.value = res.data.data
}

let scene, popup;

function initMap() {
  scene = new Scene({
    id: 'map',
    map: new GaodeMap({
      center: [102.748881, 25.128499], //中心坐标
      zoom: 15.5, //放大
      pitch: 0, //
      style: 'normal',
      token: '7f317db72e163712be7c527920937bb6'
    })
  });

  const initPop = async () => {
    window.screen = scene
    await initOringinPoint()
    scene.on("click", e => {
      const { lat, lng } = e.lnglat
      popup = new Popup({
        // 初始锚点经纬度
        lngLat: e.lnglat,
        title: '实验室',
        html: `<button class="el-button el-button--primary" onclick="add_popup(${lat},${lng})">添加</button>`
      });
      scene.addPopup(popup);
    })
  }
  scene.on('loaded', initPop);
}

//拿到本来存在的点
const initOringinPoint = async () => {
  let res = await axios.get("/adminapi/labs/getPoints")
  if (res.data.code !== 0) return;
  const textlayer = new PointLayer({ zIndex: 2 })
    .source(
      res.data.data,
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat'
        }
      }
    )
    .shape('labName', 'text')
    .size(16)
    .active({
      color: '#00f',
      mix: 0.9
    })
    .color('rgb(209, 10, 3)')
    .style({
      textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      spacing: 2, // 字符间距
      fontWeight: '600',
      padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      stroke: '#ffffff', // 描边颜色
      strokeWidth: 2, // 描边宽度
      textAllowOverlap: true
    });
  scene.addLayer(textlayer);
}

//pop弹出点击事件
window.add_popup = (lat, lng) => {
  labForm.lat = lat
  labForm.lng = lng
  //将pop隐藏
  popup.close()
  dialogVisible.value = true
}


</script>