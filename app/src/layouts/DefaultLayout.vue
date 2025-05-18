<template>
    <v-app>
      <AppSidebar />
      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import AppSidebar from '../components/AppSidebar.vue'
  </script>
  