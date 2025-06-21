<template>
  <router-view />
  <CustomSnackbar ref="snackbarRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import CustomSnackbar from './components/controls/CustomSnackbar.vue'
import { registerSnackbar } from './lib/snackbar.js'

const snackbarRef = ref(null)

onMounted(() => {
  if (snackbarRef.value) {
    registerSnackbar(snackbarRef.value)
  }
})
</script>

<style>
/* Global CSS here if needed */
</style>
