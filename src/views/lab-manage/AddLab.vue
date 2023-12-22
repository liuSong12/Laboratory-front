<template>
  <div style="height:100%;">

    <LabMap @setLatLng="setLatLng" @showDialog="showDialog" ref="initOringinPointRef" />

    <LabForm @initOringinPoint="initOringinPoint" ref="labFormRef" />

  </div>
</template>

<script setup>
import { ref} from "vue"
import LabMap from "../../components/lab-manage/LabMap.vue"
import LabForm from "../../components/lab-manage/LabForm.vue"

const initOringinPointRef = ref(null)
const labFormRef = ref(null)

const initOringinPoint = () => {
  initOringinPointRef.value.initOringinPoint()
}

const showDialog = () => {
  labFormRef.value.showDialog()
}


const setLatLng = (lat, lng) => {
  labFormRef.value.setLatLng(lat, lng)
}


</script>

<style scoped>
:deep(.amap-copyright) {
  display: none !important;
}
</style>