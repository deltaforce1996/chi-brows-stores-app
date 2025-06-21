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

            <div v-if="error" class="text-red text-center mt-2">{{ error }}</div>

            <div class="text-center mt-4">
              <span>ยังไม่มีบัญชี Chi Brows ?</span>
              <a href="/auth/register" class="text-red"> ลงทะเบียน</a>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/authService";
import { useUserStore } from "@/stores/user";
import {  showSuccess, showErr } from "@/lib/snackbar.js";

const username = ref("");
const password = ref("");
const rememberMe = ref(false);
const error = ref("");
const router = useRouter();
const userStore = useUserStore();

function handleLogin() {
  error.value = "";
  login({ username: username.value, password: password.value })
    .then(({ access_token, user }) => {
      userStore.setUser(user, access_token);
      // Optionally, handle rememberMe logic here
      showSuccess("เข้าสู่ระบบสำเร็จ");
      router.push({ path: "/" }); // Change to your home route name
    })
    .catch((err) => {
      error.value =  "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง";
      showErr("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง");
      console.log('err', err);
    });
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
