<template>
  <div
    class="truncate p-2 border-zinc-900/10 dark:border-zinc-50/10"
    @click="onClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface TableGridCellProps {
  onClick?: () => void
}

defineProps<TableGridCellProps>()
</script>