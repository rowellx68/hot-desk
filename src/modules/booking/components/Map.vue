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

interface MapEmits {
  (event: 'deskClick', cellId: string, value: string): void
}

echarts.use([TooltipComponent, GeoComponent, SVGRenderer])

const mapArea = ref<HTMLDivElement>()
let map: echarts.ECharts

echarts.registerMap('seats', { svg: seats })
const resizeChart = () => {
  map?.resize()
}

const store = useBookingStore()
const emits = defineEmits<MapEmits>()

watch(() => [store.activeDay, store.selectedWeek, store.cellsForDay], () => {
  const options = createChartOptions(store.cellsForDay)

  map?.setOption(options)
})

const onDeskClicked = (deskNumber: number) => {
  const value = store.cellsForDay.at(deskNumber - 1) ?? ''
  emits('deskClick', `${store.activeDayColumn}${deskNumber + 1}`, value)
}

onMounted(() => {
  if (!mapArea.value) {
    return
  }
  const options = createChartOptions(store.cellsForDay)

  map = echarts.init(mapArea.value)
  map.on('geoselectchanged', (selection: unknown) => {
    const { name } = selection as { name: string }
    const deskNumber = parseInt(name)

    onDeskClicked(deskNumber)
  })
  map.setOption(options)

  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
})
</script>