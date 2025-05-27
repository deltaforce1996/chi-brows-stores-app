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
      <v-col
        cols="12"
        md="6"
        class="login-right d-flex align-center justify-center"
      >
        <v-card class="elevation-0 login-form-card" flat>
          <h2 class="text-center font-weight-bold mb-6">เข้าสู่ระบบ</h2>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="username"
              label="ชื่อผู้ใช้งาน"
              outlined
              dense
              required
            />
            <v-text-field
              v-model="password"
              label="รหัสผ่าน"
              type="password"
              outlined
              dense
              required
            />

            <v-checkbox
              v-model="rememberMe"
              label="จดจำเข้าระบบ"
              class="mt-0"
              hide-details
            />

            <v-btn
              color="brown-darken-3"
              size="large"
              block
              type="submit"
              class="mt-4"
            >
              เข้าสู่ระบบ
            </v-btn>

            <div class="text-center mt-4">
              <span>ยังไม่มีบัญชี Chi Brows ?</span>
              <a href="#" class="text-red"> ลงทะเบียน</a>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";

const username = ref("");
const password = ref("");
const rememberMe = ref(false);

function handleLogin() {
  alert(
    `Username: ${username.value}\nPassword: ${password.value}\nRemember Me: ${rememberMe.value}`
  );
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
}
</style>
