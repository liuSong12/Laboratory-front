<template>
    <div style="height:100%;width: 100%; justify-content: center;position: relative" id="map"></div>
</template>

<script setup>
import { Scene, Popup, PointLayer, LayerPopup } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { onMounted,defineExpose } from "vue"
import axios from "axios"


onMounted(() => {
    initMap()
})

const emits = defineEmits(["setLatLng", 'showDialog'])
const props = defineProps({
    lat: {
        default: 102.748881,
        type: Number
    },
    lng: {
        default: 25.128499,
        type: Number
    },
    zoom: {
        default: 16,
        type: Number
    }
})

let scene, popup;

//初始化地图
function initMap() {
    scene = new Scene({
        id: 'map',
        map: new GaodeMap({
            center:  [props.lat,props.lng], //中心坐标
            zoom: props.zoom, //放大
            maxZoom: 22,
            style: 'normal',
            token: '7f317db72e163712be7c527920937bb6'
        }),
        logoVisible: false
    });

    const initPop = async () => {
        await initOringinPoint()
        scene.on("click", e => {
            if(props.zoom !== 16) return;
            const { lat, lng } = e.lnglat
            popup = new Popup({
                // 初始锚点经纬度
                lngLat: e.lnglat,
                title: '<span style="color:black;">添加实验室</span>',
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
        .shape('labName', "text")
        .size(16)
        .active({
            color: '#000',
            mix: 0.9
        })
        .color('rgb(80, 235, 200)')
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

    const layerPopup = new LayerPopup({
        items: [
            {
                layer: textlayer,
                fields: [
                    {
                        field: 'labName',
                        formatField: () => `<span style="color:black;">名称:</span>`,
                        formatValue: (name) => `<span style="color:black;">${name}</span>`
                    },
                    {
                        field: 'labCollegeName',
                        formatField: () => `<span style="color:black;">学院:</span>`,
                        formatValue: (name) => `<span style="color:black;">${name}</span>`
                    },
                    {
                        field: 'lat',
                        formatField: () => `<span style="color:black;">经度:</span>`,
                        formatValue: (name) => `<span style="color:black;">${name}</span>`
                    },
                    {
                        field: 'lng',
                        formatField: () => `<span style="color:black;">纬度:</span>`,
                        formatValue: (name) => `<span style="color:black;">${name}</span>`
                    },
                    {
                        field: 'capacity',
                        formatField: () => `<span style="color:black;">容纳人数:</span>`,
                        formatValue: (name) => `<span style="color:black;">${name}</span>`
                    },
                    {
                        field: 'labTypeName',
                        formatField: () => `<span style="color:black;">实验室类型:</span>`,
                        formatValue: (name) => `<span style="color:black;">${name}</span>`
                    }
                ],
            },
        ],
        trigger: 'hover'
    });
    scene.addPopup(layerPopup)

}

defineExpose({
    initOringinPoint
})

//pop弹出点击事件
window.add_popup = (lat, lng) => {
    emits("setLatLng", lat, lng)
    emits("showDialog")
    //将pop隐藏
    popup.close()
    // dialogVisible.value = true
}

</script>