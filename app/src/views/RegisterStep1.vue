<template>
  <AuthFormLayout
    title="ลงทะเบียน"
    subtitle="สร้างบัญชี Chi Brows ของคุณ"
  >
    <template #form>
      <v-form @submit.prevent="handleRegister">
        <div class="form-group">
          <v-text-field
            v-model="phone"
            label="เบอร์โทรศัพท์"
            variant="outlined"
            density="comfortable"
            required
            prepend-inner-icon="mdi-phone"
            class="form-input"
            type="tel"
          />
        </div>

        <div class="form-group">
          <v-text-field
            v-model="username"
            label="ชื่อผู้ใช้งาน"
            variant="outlined"
            density="comfortable"
            required
            prepend-inner-icon="mdi-account"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <v-text-field
            v-model="password"
            label="รหัสผ่าน"
            type="password"
            variant="outlined"
            density="comfortable"
            required
            prepend-inner-icon="mdi-lock"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <v-text-field
            v-model="confirmPassword"
            label="ยืนยันรหัสผ่าน"
            type="password"
            variant="outlined"
            density="comfortable"
            required
            prepend-inner-icon="mdi-lock-check"
            class="form-input"
          />
        </div>

        <v-btn
          color="primary"
          size="large"
          block
          type="submit"
          class="auth-btn"
          variant="flat"
        >
          ถัดไป
        </v-btn>
      </v-form>
    </template>

    <template #footer>
      <p class="register-text">
        มีบัญชี Chi Brows ?
        <RouterLink to="/auth/login" class="register-link">
          เข้าสู่ระบบ
        </RouterLink>
      </p>
    </template>
  </AuthFormLayout>
</template>

<script setup>
import { ref } from 'vue'
import AuthFormLayout from '@/components/AuthFormLayout.vue'
// import { useRouter } from 'vue-router'

// const router = useRouter()  

const phone = ref('')
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

function handleRegister() {
  if (password.value !== confirmPassword.value) {
    alert('รหัสผ่านไม่ตรงกัน')
    return
  }

  // Mock register action
  alert(`ลงทะเบียนเรียบร้อย!\nเบอร์: ${phone.value}\nชื่อผู้ใช้: ${username.value}`)

  // สมมุติว่าไปขั้นตอนถัดไป
  // router.push('/register-step-2') // ถ้ามีหลายขั้นตอน
}
</script>

<style scoped>
/* All styles are now handled by the AuthFormLayout component */
</style>
  