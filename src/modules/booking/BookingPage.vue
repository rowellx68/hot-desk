<template>
  <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
    <h1 class="md:col-span-4">
      Desk Booking
    </h1>
    <WeekSelect
      v-model="store.selectedWeek"
      class="md:col-span-2"
      :weeks="store.sheets"
      :disabled="store.selectedWeek === ''"
    />
  </div>
  <TableGrid
    class="mt-6"
    :cells="store.cells"
    :headers="store.datesInWeek"
    @cell-click="cellClicked"
  />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useGoogleSheets, useGapi } from 'utils/google-api-helper'
import { useBookingStore } from './store/booking-store'
import { useLoginStore } from 'modules/login/store/login-store'
import { sheetId } from 'config/google-config.json'
import WeekSelect from './components/WeekSelect.vue'
import TableGrid from './components/TableGrid.vue'

const gapi = useGapi()
const store = useBookingStore()
const { name } = storeToRefs(useLoginStore())

const columns = ['B', 'C', 'D', 'E', 'F']

// this gets called when the component is rendered on the page
onMounted(async () => {
  const sheets = await useGoogleSheets(gapi)
  await store.getSheets(sheets, sheetId)
})

// this gets called when the value of `selectedWeek` changes
watch(() => store.selectedWeek, async () => {
  const sheets = await useGoogleSheets(gapi)
  await store.getCells(sheets, sheetId, store.selectedWeek)
})

const cellClicked = async (rowId: number, colId: number, value: string) => {
  if (!!value && value.toLocaleLowerCase().trim() !== name.value.toLocaleLowerCase().trim()) {
    alert('Not allowed')

    return
  }

  const cell = `${columns[colId]}${rowId + 2}`

  const sheets = await useGoogleSheets(gapi)
  await store.updateCell(sheets, sheetId, store.selectedWeek, cell, name.value)
}

</script>