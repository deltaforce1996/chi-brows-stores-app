<template>
  <v-row justify="center">
    <v-col cols="12" class="pa-2">
      <v-card class="pa-4 mx-auto" outlined>
        <v-card-title>ตัวกรอง</v-card-title>
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              label="รหัสพนักงาน/นักศึกษา"
              :items="idOptions"
              v-model="form.id"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              label="รูปแบบการให้บริการ"
              :items="serviceTypes"
              v-model="form.serviceType"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              label="ชื่อ - สกุล"
              :items="nameOptions"
              v-model="form.name"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              label="หมายเลขโทรศัพท์"
              :items="phoneOptions"
              v-model="form.phone"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              label="อีเมล"
              :items="emailOptions"
              v-model="form.email"
              clearable
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>
        <!-- @click="submitForm" -->

        <v-card-actions class="justify-end mt-4">
          <v-btn class="next-button" @click="submitForm"> ถัดไป </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from "vue";

// ✅ ใช้ defineEmits เพื่อส่งข้อมูลกลับไป
const emit = defineEmits(["submit"]);

const form = ref({
  id: null,
  name: null,
  email: null,
  phone: null,
  serviceType: null,
});

// ตัวอย่าง options
const idOptions = ["60123456", "60234567"];
const nameOptions = ["สมชาย ใจดี", "สมหญิง แสนสวย"];
const emailOptions = ["example1@email.com", "example2@email.com"];
const phoneOptions = ["0812345678", "0899998888"];
const serviceTypes = ["กรุณาระบุคณะ", "ออนไลน์", "มาที่สำนักงาน"];

function submitForm() {
  emit("submit", { ...form.value });
}
</script>
<style scoped>
.next-button {
  background-color: #d66b63;
  color: white;
  border-radius: 8px;
  min-width: 100px;
  height: 40px;
  text-transform: none;
  font-weight: bold;
  font-size: 14px;
}
.wide-card {
  max-width: 1200px;
  width: 100%;
}
</style>
