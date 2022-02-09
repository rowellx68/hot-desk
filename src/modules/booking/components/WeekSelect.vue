<template>
  <Listbox
    :model-value="modelValue"
    :disabled="disabled"
    @update:model-value="modelUpdate"
  >
    <div class="relative mt-1">
      <ListboxButton
        class="relative w-full py-2 pl-3 pr-10 text-left bg-white dark:bg-zinc-700 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-amber-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm"
        :class="{
          'cursor-not-allowed opacity-50': disabled
        }"
      >
        <span class="block truncate">{{ modelValue !== '' ? modelValue : 'Select Week' }}</span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <SelectorIcon
            class="w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-zinc-700 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="v of weeks"
            v-slot="{ active, selected }"
            :key="v"
            :value="v"
            as="template"
          >
            <li
              :class="[
                active || selected ? 'text-amber-900 bg-amber-100' : '',
                'cursor-default select-none relative py-2 pl-10 pr-4',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate',
                ]"
              >{{ v }}</span>
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600 dark:text-amber-400"
              >
                <CheckIcon
                  class="w-5 h-5"
                  aria-hidden="true"
                />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

interface WeekSelectProps {
  modelValue: string
  weeks: string[]
  disabled?: boolean
}

interface WeekSelectEmits {
  (event: 'update:model-value', value: string): void
}

const emits = defineEmits<WeekSelectEmits>()
const modelUpdate = (value: string) => emits('update:model-value', value)

defineProps<WeekSelectProps>()
</script>