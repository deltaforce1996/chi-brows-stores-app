<template>
  <v-container fluid class="login-container fill-height pa-0">
    <v-row no-gutters class="fill-height">
      
      <!-- Left Logo Panel -->
      <v-col cols="12" md="6" class="d-none d-md-flex login-left">
        <div class="branding">
          <h1 class="brand-title">Chi Brows</h1>
          <p class="brand-subtitle">THE PROFESSIONAL EYEBROWS</p>
        </div>
      </v-col>

      <!-- Right Form Panel -->
      <v-col cols="12" md="6" class="login-right d-flex align-center justify-center">
        <v-card class="elevation-0 login-form-card" flat>
          <h2 class="text-center font-weight-bold mb-6">ลงทะเบียน</h2>

          <v-form @submit.prevent="handleNext">
            <v-text-field
              v-model="fullName"
              label="ชื่อ–นามสกุล"
              outlined
              dense
              required
            />

            <v-text-field
              v-model="birthdate"
              label="วัน–เดือน–ปีเกิด"
              type="date"
              outlined
              dense
              required
            />

            <v-text-field
              v-model="email"
              label="อีเมล"
              type="email"
              outlined
              dense
              required
            />

            <v-btn
              color="brown-darken-3"
              size="large"
              block
              type="submit"
              class="mt-4"
            >
              ถัดไป
            </v-btn>

            <div class="text-center mt-4">
              <span>มีบัญชี Chi Brows ?</span>
              <RouterLink to="/auth/login" class="text-red"> เข้าสู่ระบบ</RouterLink>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')
const birthdate = ref('')
const email = ref('')

function handleNext() {
  alert(`ชื่อ: ${fullName.value}\nวันเกิด: ${birthdate.value}\nอีเมล: ${email.value}`)
  // router.push('/register-step-3') // ถ้ามีขั้นตอนถัดไป
}
</script>

<style scoped>
.login-container {
  background-color: #fff;
}

.login-left {
  background-color: #8b2e2e;
  color: white;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}

.brand-title {
  font-size: 48px;
  font-weight: bold;
  color: gold;
  margin-bottom: 8px;
}

.brand-subtitle {
  font-size: 14px;
  letter-spacing: 1px;
  color: #ffd700cc;
}

.login-form-card {
  width: 100%;
  max-width: 400px;
}

.text-red {
  color: #b71c1c;
  font-weight: 500;
  cursor: pointer;
}
</style>
