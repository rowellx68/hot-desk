<template>
  <nav class="bg-zinc-100 dark:bg-zinc-900 sticky top-0 z-10 shadow">
    <div class="max-w-7xl mx-auto">
      <div class="py-4 lg:px-8 mx-4 lg:mx-0 flex">
        <router-link
          to="/"
          class="uppercase"
        >
          Hot Desk
        </router-link>
        <div
          v-if="store.loggedIn"
          class="flex-1 flex justify-end"
        >
          <img
            :src="store.image"
            :alt="store.name"
            class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
          >
          <span class="hidden md:ml-2 md:inline-block">
            {{ store.name }}
          </span>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useLoginStore } from 'modules/login/store/login-store'

const store = useLoginStore()
</script>