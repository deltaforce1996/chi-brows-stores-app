<template>
  <AuthFormLayout
    title="เข้าสู่ระบบ"
    subtitle="ยินดีต้อนรับกลับสู่ Chi Brows"
  >
    <template #form>
      <v-form @submit.prevent="handleLogin">
        <div class="form-group">
          <v-text-field
            v-model="username"
            label="ชื่อผู้ใช้งาน"
            variant="outlined"
            density="comfortable"
            required
            prepend-inner-icon="mdi-account"
            class="form-input"
            :error="!!error"
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
            :error="!!error"
          />
        </div>

        <div class="form-options">
          <v-checkbox
            v-model="rememberMe"
            label="จดจำเข้าระบบ"
            density="compact"
            hide-details
            color="primary"
          />
        </div>

        <v-btn
          color="primary"
          size="large"
          block
          type="submit"
          class="auth-btn"
          variant="flat"
          :loading="false"
        >
          เข้าสู่ระบบ
        </v-btn>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          class="mt-4"
          density="compact"
        >
          {{ error }}
        </v-alert>
      </v-form>
    </template>

    <template #footer>
      <p class="register-text">
        ยังไม่มีบัญชี Chi Brows ?
        <router-link to="/auth/register" class="register-link">
          ลงทะเบียนเลย
        </router-link>
      </p>
    </template>
  </AuthFormLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "@/services/authService";
import { useUserStore } from "@/stores/user";
import {  showSuccess, showErr } from "@/lib/snackbar.js";
import AuthFormLayout from "@/components/AuthFormLayout.vue";

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
/* All styles are now handled by the AuthFormLayout component */
</style>
