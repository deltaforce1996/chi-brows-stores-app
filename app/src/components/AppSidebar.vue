<template>
    <v-navigation-drawer app permanent width="260" class="sidebar">
      <v-list density="comfortable" nav>
        <!-- Profile -->
        <v-list-item class="profile" lines="two">
          <v-avatar size="48">
            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="avatar" />
          </v-avatar>
          <v-list-item-title class="mt-2 font-weight-medium">Benjamin Button</v-list-item-title>
          <v-list-item-subtitle class="text-grey">Admin</v-list-item-subtitle>
        </v-list-item>
  
        <!-- Menu -->
        <v-divider class="my-3" />
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :active="item.to === $route.path"
          active-class="active-link"
          link
        >
          <template #prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
  
        <v-spacer />
        
        <!-- Logout -->
        <v-divider class="my-2" />
        <v-list-item class="logout" link @click="logout">
          <template #prepend>
            <v-icon color="red">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="text-red">ออกจากระบบ</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/stores/user'
  
  const router = useRouter()
  const userStore = useUserStore()

  const menuItems = [
    { title: 'หน้าแรก', icon: 'mdi-home', to: '/' },
    { title: 'ข้อมูลลูกค้า', icon: 'mdi-account-multiple', to: '/FillinCustomer' }
  ]
  
  function logout() {
    userStore.logout()
    router.push('/auth/login')
  }
  </script>
  
  <style scoped>
  .sidebar {
    background-color: #f8f8f8;
    border-right: 1px solid #e0e0e0;
    padding-top: 20px;
  }
  
  .profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .active-link {
    background-color: #f0f0f0 !important;
    font-weight: bold;
    color: #b71c1c;
  }
  .logout {
    margin-top: auto;
  }
  </style>
  