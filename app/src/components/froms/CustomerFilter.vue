<template>
  <v-row justify="center">
    <v-col cols="12" class="pa-2">
      <v-card class="pa-4 mx-auto" outlined>
        <v-card-title>ค้นหาผู้ใช้</v-card-title>

        <v-text-field
          label="ค้นหาจากชื่อ, เบอร์, อีเมล หรือรหัส"
          v-model="searchText"
          variant="outlined"
          density="compact"
          clearable
        />

        <v-card-actions class="justify-end mt-4">
          <v-btn class="next-button" @click="submitSearch">ค้นหา</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'

// 👇 สร้าง emit เพื่อส่งข้อมูลออกไป
const emit = defineEmits(['submit'])

// 👇 ตัวแปรเก็บข้อความที่ค้นหา
const searchText = ref('')

// 👇 ส่งค่ากลับไปยัง parent component
function submitSearch() {
  emit('submit', searchText.value)
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
</style>
