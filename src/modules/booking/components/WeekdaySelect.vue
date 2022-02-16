<template>
  <TabGroup @change="onChange">
    <TabList class="flex p-1 space-x-1 bg-zinc-900/20 rounded-xl">
      <Tab
        v-for="(day) in datesInWeek"
        :key="day"
        v-slot="{ selected }"
        as="template"
      >
        <button
          :class="[
            'w-full py-2.5 text-xs leading-5 font-medium text-amber-700 rounded-lg',
            'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-amber-400 ring-white ring-opacity-60',
            selected
              ? 'bg-amber-100 shadow'
              : 'text-zinc-100 hover:bg-amber-100/70 hover:text-amber-700',
          ]"
        >
          <div>
            {{ day }}
          </div>
        </button>
      </Tab>
    </TabList>
  </TabGroup>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab } from '@headlessui/vue'
import { useBookingStore } from 'modules/booking/store/booking-store'

interface WeekdaySelectProps {
  modelValue: number
  datesInWeek: string[]
}

interface WeekdaySelectEmits {
  (event: 'update:model-value', value: number): void
}

const emits = defineEmits<WeekdaySelectEmits>()

const onChange = (ev: Event) => {
  emits('update:model-value', (ev as unknown as number))
}

defineProps<WeekdaySelectProps>()
</script>