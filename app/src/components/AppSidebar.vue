<template>
  <v-navigation-drawer app permanent width="260" class="sidebar">
    <v-list density="comfortable" nav>
      <!-- Profile -->
      <v-list-item class="profile" lines="two">
<v-avatar size="48">
  <template v-if="userProfile.avatar">
    <img :src="userProfile.avatar" alt="avatar" />
  </template>
  <template v-else>
    <v-icon size="36">mdi-account</v-icon>
  </template>
</v-avatar>
        <v-list-item-title class="mt-2 font-weight-medium">
          {{ userProfile.name }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-grey">
          {{ userProfile.role }}
        </v-list-item-subtitle>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getEmployeeMe } from '@/services/employeeService'

const router = useRouter()
const userStore = useUserStore()

// 🧑‍💼 ข้อมูลผู้ใช้จาก API
const userProfile = ref({
  name: '',
  role: '',
  avatar: null
})

// 📋 เมนู Sidebar
const menuItems = [
  { title: 'หน้าแรก', icon: 'mdi-home', to: '/' },
  { title: 'ข้อมูลลูกค้า', icon: 'mdi-account-multiple', to: '/FillinCustomer' }
]

// const defaultAvatar = 'https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png'

// 📡 เรียก API getEmployeeMe
async function fetchUserProfile() {
  try {
    const data = await getEmployeeMe()
    userProfile.value = {
      name: data.fullname,
      role: data.username || 'Admin',
      avatar: ''
    }
  } catch (err) {
    console.error('โหลดข้อมูลผู้ใช้ไม่สำเร็จ ❗', err)
  }
}

// 🚪 ออกจากระบบ
function logout() {
  userStore.logout()
  router.push('/auth/login')
}

onMounted(fetchUserProfile)
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
