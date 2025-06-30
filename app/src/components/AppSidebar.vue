<template>
  <v-navigation-drawer app permanent width="280" class="sidebar">
    <div class="sidebar-content">
      <!-- Profile Section -->
      <div class="profile-section">
        <div class="profile-card">
          <v-avatar size="64" class="profile-avatar">
            <template v-if="userProfile.avatar">
              <img :src="userProfile.avatar" alt="avatar" />
            </template>
            <template v-else>
              <v-icon size="40" color="white">mdi-account-circle</v-icon>
            </template>
          </v-avatar>
          <div class="profile-info">
            <h3 class="profile-name">{{ userProfile.name }}</h3>
            <p class="profile-role">{{ userProfile.role }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation Menu -->
      <div class="menu-section">
        <nav class="menu-nav">
          <div
            v-for="item in menuItems"
            :key="item.title"
            class="menu-item"
            :class="{ 'menu-item--active': item.to === $route.path }"
            @click="$router.push(item.to)"
          >
            <div class="menu-item-content">
              <v-icon class="menu-icon">{{ item.icon }}</v-icon>
              <span class="menu-text">{{ item.title }}</span>
            </div>
            <div class="menu-item-indicator"></div>
          </div>
        </nav>
      </div>

      <!-- Logout Section -->
      <div class="logout-section">
        <div class="logout-item" @click="logout">
          <div class="logout-content">
            <v-icon class="logout-icon">mdi-logout</v-icon>
            <span class="logout-text">ออกจากระบบ</span>
          </div>
        </div>
      </div>
    </div>
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
  background: #ffffff;
  border: none;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
}

.sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
}

/* Profile Section */
.profile-section {
  padding: 24px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  /* border-bottom: 1px solid #e9ecef; */
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.profile-avatar {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 8px 24px rgba(220, 53, 69, 0.3);
  margin-bottom: 16px;
  border: 3px solid rgba(220, 53, 69, 0.1);
}

.profile-info {
  color: #495057;
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #212529;
  text-shadow: none;
}

.profile-role {
  font-size: 14px;
  margin: 0;
  color: #6c757d;
  font-weight: 400;
}

/* Menu Section */
.menu-section {
  flex: 1;
  padding: 24px 0;
  overflow-y: auto;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px;
}

.menu-item {
  position: relative;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.menu-item:hover {
  background: rgba(220, 53, 69, 0.05);
  transform: translateX(4px);
}

.menu-item--active {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.15);
}

.menu-item--active .menu-item-indicator {
  width: 4px;
  background: #dc3545;
}

.menu-item-content {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  position: relative;
  z-index: 1;
}

.menu-item-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 24px;
  background: #dc3545;
  border-radius: 0 4px 4px 0;
  transition: width 0.3s ease;
}

.menu-icon {
  color: #495057;
  margin-right: 16px;
  font-size: 24px;
}

.menu-text {
  color: #495057;
  font-size: 16px;
  font-weight: 500;
  text-shadow: none;
}

.menu-item--active .menu-icon,
.menu-item--active .menu-text {
  color: #dc3545;
  font-weight: 600;
}

/* Logout Section */
.logout-section {
  padding: 16px;
  /* border-top: 1px solid #e9ecef;
  background: #f8f9fa; */
}

.logout-item {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
}

.logout-item:hover {
  background: rgba(220, 53, 69, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.logout-content {
  display: flex;
  align-items: center;
  padding: 14px 20px;
}

.logout-icon {
  color: #dc3545;
  margin-right: 16px;
  font-size: 20px;
}

.logout-text {
  color: #dc3545;
  font-size: 15px;
  font-weight: 500;
}

.logout-item:hover .logout-icon,
.logout-item:hover .logout-text {
  color: #b02a37;
}

/* Scrollbar */
.menu-section::-webkit-scrollbar {
  width: 4px;
}

.menu-section::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
}

.menu-section::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.menu-section::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
