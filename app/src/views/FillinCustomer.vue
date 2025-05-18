<template>
    <v-container fluid>
      <!-- เรียกใช้ฟอร์ม -->
      <fromCustomer @submit="handleSubmit" />
    </v-container>
  </template>
  
  <script setup>
  import fromCustomer from '../components/froms/fromCustomer.vue'
  
  function handleSubmit(formData) {
    console.log('📦 ข้อมูลที่ได้รับจากฟอร์ม:', formData)
  
    // ✅ ตัวอย่าง: ส่งไปยัง API
    // await axios.post('/api/booking', formData)
  
    // ✅ หรืออัปเดต store
    // store.saveBooking(formData)
  
    // ✅ หรือเปลี่ยนหน้า
    // router.push('/confirmation')
  }
  </script>
  