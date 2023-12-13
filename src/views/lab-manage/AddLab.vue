<template>
  <div style="height:100%;">

    <div style="height:100%; justify-content: center;position: relative" id="map"></div>

    <el-dialog :model-value="dialogVisible" width="30%">
      <template #header>
        <span>添加实验室</span>
      </template>
      <div>
        <el-form :model="labForm" ref="labFormRef" :rules="rules">
          <el-form-item label="实验室名称" prop="labName">
            <el-input v-model="labForm.labName"></el-input>
          </el-form-item>
          <el-form-item label="容纳人数" prop="capacity" style="margin-left: 13px;">
            <el-input v-model="labForm.capacity" type="number"></el-input>
          </el-form-item>
          <el-form-item label="实验室类型" prop="labType">
            <el-select v-model="labForm.labType" placeholder="请选择实验室类型">
              <el-option v-for="item in labType" :key="item.id" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary">
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

const dialogVisible = ref(false)

const labForm = reactive({
  labName: '',
  capacity: '',
  labType: [{
    id: 1,
    label: "物理实验室",
    value: 1
  },
  {
    id: 2,
    label: "化学实验室",
    value: 2
  },
  {
    id: 3,
    label: "生物实验室",
    value: 3
  },
  {
    id: 4,
    label: "科学实验室",
    value: 4
  }]
})




const rules = reactive({
  labName: [
    { required: true, message: '请输入实验室名称',trigger:'blur' }
  ],
  capacity: [
    { required: true, message: '请输入实验室容纳人数',trigger:'blur' }
  ],
  labType: [
    { required: true, message: '请输入实验室类型',trigger:'blur' }
  ]
})







onMounted(() => {
  initMap()
})

let scene;

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

  const initPop = () => {
    window.screen = scene
    scene.on("click", e => {
      console.log(e)
      const { lat, lng } = e.lnglat
      const popup = new Popup({
        // 初始锚点经纬度
        // offsets: [0, 0],
        // lngLat: {
        //   lng: 102.748881,
        //   lat: 25.128499,
        // },
        lngLat: e.lnglat,
        // Popup 标题
        title: '实验室',
        // Popup 内容
        html: `<button class="el-button el-button--primary" onclick="add_popup(${lat},${lng})">添加</button>`
      });

      // 更新 Popup 内容
      // popup.setHTML('位置');
      // popup.setLngLat(e.lngLat)
      scene.addPopup(popup);
      // 更新 Popup 锚点经纬度
      // popup.setLngLat({
      //   lng: 130,
      //   lat: 40,
      // });

    })
  }
  scene.on('loaded', initPop);
}

window.add_popup = (lat, lng) => {
  dialogVisible.value = true
  return;
  //经纬度
  //下面的x，y要经纬度与中心点的比例
  const textlayer = new PointLayer({ zIndex: 2 })
    .source(
      [
        {
          x: lng,
          y: lat,
          text: "小屋"
        }
      ],
      {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y'
        }
      }
    )
    .shape('text', 'text')
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


</script>