<template>
  <div class="grid grid-cols-5 md:grid-cols-6 overflow-auto border-y border-zinc-900/10 dark:border-zinc-50/10">
    <div class="col-span-1 border-r border-zinc-900/10 dark:border-zinc-50/10">
      <TableGridHeaderCell class="border-l text-center">
        Table
        <div class="text-xs">
          #
        </div>
      </TableGridHeaderCell>
      <TableGridCell
        v-for="(_, i) in cells"
        :key="i"
        class="font-semibold border-l border-t text-center"
        :title="`Table ${i + 1}`"
      >
        {{ i + 1 }}
      </TableGridCell>
    </div>
    <div class="col-span-4 md:col-span-5 gap-2 overflow-auto shadow-inner md:shadow-none border-r border-zinc-900/10 dark:border-zinc-50/10">
      <div class="min-w-[30em] grid grid-cols-5">
        <TableGridHeaderCell
          v-for="(d, i) in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']"
          :key="d"
          :class="{
            'border-r': (i + 1) % 5 !== 0
          }"
        >
          {{ d }}
          <div class="text-xs font-light text-zinc-300">
            {{ headers[i] }}
          </div>
        </TableGridHeaderCell>
        <template v-for="(row, ri) in cells">
          <TableGridCell
            v-for="(cell, ci) in row"
            :key="ci"
            class="border-t cursor-pointer"
            :class="{
              'bg-zinc-300/30 dark:bg-zinc-700/30 !cursor-not-allowed': !!cell,
              'border-r': (ci + 1) % 5 !== 0,
            }"
            :title="cell"
            @click="() => onCellClick(ri, ci, cell)"
          >
            {{ cell }}&nbsp;
          </TableGridCell>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TableGridHeaderCell from './TableGridHeaderCell.vue'
import TableGridCell from './TableGridCell.vue'

interface TableGridProps {
  cells: string[][]
  headers: string[]
}

defineProps<TableGridProps>()

const onCellClick = (ri: number, ci: number, value: string) => {
  if (value) {
    return
  }

  const cols = ['B', 'C', 'D', 'E', 'F']
  alert(`cell ${cols[ci]}${ri+2}`)
}
</script>