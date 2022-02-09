<template>
  <h1>Login</h1>

  <button
    class="button primary mt-2"
    @click="login"
  >
    Log me In
  </button>
</template>

<script setup lang="ts">
import { useLoginStore } from 'modules/login/store/login-store'
import { useGapi } from 'utils/google-api-helper'

const gapi = useGapi()
const store = useLoginStore()

const login = (ev: Event) => {
  ev.preventDefault()

  store.login(gapi)
}

</script>