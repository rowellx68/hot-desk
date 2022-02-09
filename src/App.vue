<template>
  <nav-bar />
  <main class="max-w-7xl mx-auto">
    <div class="py-4 lg:px-8 mx-4 lg:mx-0">
      <router-view />
    </div>
  </main>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from 'components/NavBar.vue'
import { useLoginStore } from 'modules/login/store/login-store'

const store = useLoginStore()
const router = useRouter()

watch(() => store.loggedIn, () => {
  if (store.loggedIn) {
    router.replace({ name: 'booking' })
  }
  else {
    router.push({ name: 'login' })
  }
})
</script>