<template>
  <div class="hero-section">
    <v-container>
      <div class="d-flex align-center mb-2">
        <v-icon size="24" :color="iconColor" class="mr-2">{{ icon }}</v-icon>
        <h1 class="text-h5 font-weight-bold text-grey-darken-3">{{ title }}</h1>
      </div>
      <p class="text-body-1 text-grey-darken-1">{{ subtitle }}</p>
    </v-container>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'primary'
  }
})
</script>

<style scoped>
.hero-section {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem 0 2rem 0;
  margin-bottom: 0;
}
</style> 