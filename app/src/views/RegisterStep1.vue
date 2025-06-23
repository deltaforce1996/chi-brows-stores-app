<template>
  <AuthFormLayout title="ลงทะเบียน" subtitle="สร้างบัญชี Chi Brows ของคุณ">
    <template #form>
      <v-form @submit.prevent="handleRegister">
        <v-text-field
          v-model="username"
          label="ชื่อผู้ใช้งาน"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          required
        />
        <v-text-field
          v-model="password"
          label="รหัสผ่าน"
          type="password"
          prepend-inner-icon="mdi-lock"
          variant="outlined"
          required
        />
        <v-text-field
          v-model="confirmPassword"
          label="ยืนยันรหัสผ่าน"
          type="password"
          prepend-inner-icon="mdi-lock-check"
          variant="outlined"
          required
        />
        <v-text-field
          v-model="fullName"
          label="ชื่อ–นามสกุล"
          prepend-inner-icon="mdi-account-circle"
          variant="outlined"
          required
        />
        <v-text-field
          v-model="tel"
          label="เบอร์โทรศัพท์"
          prepend-inner-icon="mdi-phone"
          type="tel"
          variant="outlined"
          required
        />
        <v-text-field
          v-model="email"
          label="อีเมล"
          prepend-inner-icon="mdi-email"
          type="email"
          variant="outlined"
          required
        />
        <v-text-field
          v-model="birthday"
          label="วันเกิด"
          prepend-inner-icon="mdi-calendar"
          type="date"
          variant="outlined"
          required
        />

        <v-btn type="submit" block color="primary" variant="flat">ถัดไป</v-btn>
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
import { ref } from "vue";
import AuthFormLayout from "@/components/AuthFormLayout.vue";
import { registerEmployee } from "@/services/employeeService";
import { showSuccess, showErr } from "@/lib/snackbar.js";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const fullName = ref("");
const tel = ref("");
const email = ref("");
const birthday = ref("");

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    alert("❌ รหัสผ่านไม่ตรงกัน");
    return;
  }

  // ตรวจสอบข้อมูลครบ
  if (
    !username.value ||
    !password.value ||
    !fullName.value ||
    !tel.value ||
    !email.value ||
    !birthday.value
  ) {
    alert("⚠️ กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }
  const payload = {
    username: username.value,
    password: password.value,
    fullname: fullName.value,
    tel: tel.value,
    email: email.value,
    birthday: birthday.value,
  };

  try {
    const res = await registerEmployee(payload);
    console.log("✅ ลงทะเบียนสำเร็จ:", res);
    showSuccess("ลงทะเบียนสำเร็จ");
    router.push("/auth/login");

    // alert('🎉 ลงทะเบียนสำเร็จ!')
  } catch (err) {
    console.error("❌ ลงทะเบียนล้มเหลว:", err);
    // alert('เกิดข้อผิดพลาดในการลงทะเบียน')
    showErr("ลงทะเบียนไม่สำเร็จ");
  }
}
</script>

<style scoped>
/* All styles are now handled by the AuthFormLayout component */
</style>
