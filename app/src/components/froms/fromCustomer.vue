<template>
  <v-row justify="center">
    <v-col cols="12" class="pa-2">
      <v-form @submit.prevent="submitForm">
        <!-- ข้อมูลส่วนตัว -->
        <v-card class="pa-6 mb-6" outlined>
          <v-card-title class="text-red font-weight-bold">ข้อมูลส่วนตัว</v-card-title>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field density="compact" label="ชื่อ-สกุล" v-model="form.fullName" placeholder="Placeholder" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field density="compact" label="ชื่อเล่น" v-model="form.nickname" placeholder="Placeholder" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field density="compact" label="Facebook" v-model="form.facebook" placeholder="Placeholder" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field density="compact" label="Line" v-model="form.line" placeholder="Placeholder" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field density="compact" label="ที่อยู่" v-model="form.address" placeholder="Placeholder" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field density="compact" label="เบอร์โทร" v-model="form.phone" placeholder="Placeholder" variant="outlined" />
            </v-col>
          </v-row>
        </v-card>
  
        <!-- รายละเอียดการบริการ -->
        <v-card class="pa-6 mb-6" outlined>
          <v-card-title class="text-red font-weight-bold">รายละเอียดการบริการ</v-card-title>
          <v-row>
            <v-col cols="12" >
              <v-select
                label="รูปแบบการให้บริการ"
                :items="serviceTypes"
                v-model="form.serviceType"
                placeholder="กรุณาระบุคะ"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12" >
              <v-text-field label="โรคประจำตัว" v-model="form.medicalCondition" placeholder="Placeholder" variant="outlined" />
            </v-col>
            <v-col cols="12" >
              <v-select
                label="ชื่อผู้ให้บริการ"
                :items="providers"
                v-model="form.provider"
                placeholder="กรุณาระบุคะ"
                variant="outlined"
                clearable
                density="compact"
              />
            </v-col>
            <v-col cols="12" >
              <v-text-field
                label="วันที่ - เวลา"
                v-model="form.datetime"
                type="date"
                variant="outlined"
                prepend-inner-icon="mdi-calendar"
                density="compact"
              />
            </v-col>
          </v-row>
        </v-card>
  
        <!-- ปุ่มถัดไป -->
        <v-card-actions class="justify-center">
          <v-btn class="next-button" type="submit" variant="outlined">ถัดไป</v-btn>
        </v-card-actions>
      </v-form>
    </v-col>
  </v-row>  
</template>
  
  <script setup>
  import { ref } from 'vue'
  
  const form = ref({
    fullName: '',
    nickname: '',
    facebook: '',
    line: '',
    address: '',
    phone: '',
    serviceType: null,
    medicalCondition: '',
    provider: null,
    datetime: ''
  })
  
  // ตัวเลือก dropdown
  const serviceTypes = ['ออนไลน์', 'พบที่สำนักงาน', 'โทรศัพท์']
  const providers = ['คุณหมอเอ', 'คุณหมอบี', 'คุณซี']
  
  function submitForm() {
    console.log('📤 ส่งข้อมูล:', form.value)
    // คุณสามารถ emit หรือไป API ได้ที่นี่
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
  