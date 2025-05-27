<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from "vue";
import { login } from "@/services/authService";

// ไม่ต้อง import อะไร เพราะเราใช้ <router-view /> แล้ว
async function handleLogin() {
  try {
    const user = await login({
      username: "admin",
      password: "admin1234",
    });
    console.log("Welcome", user);
  } catch (err) {
    alert("Login failed ", err);
  }
}
onMounted(() => {
  setTimeout(async () => {
    await handleLogin();
  }, 5000);
});
</script>

<style>
/* คุณสามารถเพิ่ม Global CSS ได้ตรงนี้ถ้าต้องการ */
</style>
