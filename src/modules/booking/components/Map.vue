<template>
  <div
    ref="mapArea"
    class="w-full h-96 z-0"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { TooltipComponent, GeoComponent } from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'
import { useBookingStore } from 'modules/booking/store/booking-store'
import seats from 'assets/seats-landscape.svg?raw'
import { createChartOptions } from '../utils/map-helper'

echarts.use([TooltipComponent, GeoComponent, SVGRenderer])

const mapArea = ref<HTMLDivElement>()
let map: echarts.ECharts

echarts.registerMap('seats', { svg: seats })
const resizeChart = () => {
  map?.resize()
}

const store = useBookingStore()

watch(() => [store.activeDay, store.selectedWeek, store.cellsForDay], () => {
  const options = createChartOptions(store.cellsForDay)

  map?.setOption(options)
})

onMounted(() => {
  if (!mapArea.value) {
    return
  }
  const options = createChartOptions(store.cellsForDay)

  map = echarts.init(mapArea.value)
  map.on('geoselectchanged', (selection: any) => {
    console.log(selection.name)
  })
  map.setOption(options)

  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
})
</script>