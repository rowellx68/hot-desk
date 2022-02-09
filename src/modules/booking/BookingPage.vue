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
  />
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useGoogleSheets, useGapi } from 'utils/google-api-helper'
import { useBookingStore } from './store/booking-store'
import { sheetId } from 'config/google-config.json'
import WeekSelect from './components/WeekSelect.vue'
import TableGrid from './components/TableGrid.vue'

const gapi = useGapi()
const store = useBookingStore()

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

</script>