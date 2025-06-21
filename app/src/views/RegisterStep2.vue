<template>
  <AuthFormLayout
    title="ลงทะเบียน"
    subtitle="กรอกข้อมูลส่วนตัวของคุณ"
  >
    <template #form>
      <v-form @submit.prevent="handleNext">
        <div class="form-group">
          <v-text-field
            v-model="fullName"
            label="ชื่อ–นามสกุล"
            variant="outlined"
            density="comfortable"
            required
            prepend-inner-icon="mdi-account-circle"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <v-text-field
            v-model="birthdate"
            label="วัน–เดือน–ปีเกิด"
            type="date"
            variant="outlined"
            density="comfortable"
            required
            prepend-inner-icon="mdi-calendar"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <v-text-field
            v-model="email"
            label="อีเมล"
            type="email"
            variant="outlined"
            density="comfortable"
            required
            prepend-inner-icon="mdi-email"
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

const fullName = ref('')
const birthdate = ref('')
const email = ref('')

function handleNext() {
  alert(`ชื่อ: ${fullName.value}\nวันเกิด: ${birthdate.value}\nอีเมล: ${email.value}`)
  // router.push('/register-step-3') // ถ้ามีขั้นตอนถัดไป
}
</script>

<style scoped>
/* All styles are now handled by the AuthFormLayout component */
</style>
