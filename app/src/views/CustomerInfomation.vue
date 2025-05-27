<template>
    <v-container fluid>
      <h1 class="text-h5 mb-4">รายชื่อลูกค้า</h1>

      <CustomerFilter
      @submit="handleBookingSubmit"
       />
<div class="mt-5">
      <CustomerTable />
</div>
    </v-container>
  </template>
  
  <script setup>
  import CustomerFilter from '../components/froms/CustomerFilter.vue'
  import CustomerTable from '../components/table/CustomerTable.vue'

  function handleBookingSubmit(data) {
  console.log('📦 ได้รับข้อมูลจาก BookingForm:', data)
  // 👉 ส่งไปยัง API หรือจัดการต่อได้เลย
}
  </script>
  