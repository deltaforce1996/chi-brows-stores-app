<template>
  <v-container fluid class="pa-0">
    <!-- Header Section -->
    <PageHeader
      title="เพิ่มลูกค้าใหม่"
      subtitle="กรอกข้อมูลลูกค้าและรายละเอียดการบริการ"
      icon="mdi-account-plus"
    />

    <v-container class="mt-n6">
      <formCustomer @submit="handleSubmit" />
    </v-container>
  </v-container>
</template>

<script setup>
import formCustomer from '../components/froms/fromCustomer.vue'
import { createOrderWithCustomer, uploadOrderImage } from '@/services/orderService'
import { showSuccess, showErr } from "@/lib/snackbar.js";
import { useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'


const router = useRouter()

async function handleSubmit(formData) {
  console.log('📦 ฟอร์มดิบ:', formData)

  const payload = {
    customer: {
      tel: formData.phone,
      line: formData.line,
      facebook: formData.facebook,
      fullname: formData.fullName,
      nickname: formData.nickname,
      address: formData.address,
      birthday: formData.birthday || ''
    },
    employeeId: formData.provider || '',
    items: [
      {
        productId: formData.serviceType || '',
        quantity: 1
      }
    ],
    notes: formData.medicalCondition || '',
    price: Number(formData.price) || 0,
    date: new Date().toISOString()
  }

  try {
    const response = await createOrderWithCustomer(payload)
    console.log('✅ สร้างออร์เดอร์สำเร็จ:', response)

    const orderId = response?.id || response?.orderId

    if (formData.image && orderId) {
      try {
        await uploadOrderImage(orderId, formData.image)
        console.log('📸 อัปโหลดรูปภาพสำเร็จ')
        showSuccess("บันทึกข้อมูลและรูปภาพสำเร็จ")
      } catch (uploadError) {
        console.error('❌ อัปโหลดรูปภาพล้มเหลว:', uploadError)
        showSuccess("บันทึกข้อมูลสำเร็จ")
      }
    } else {
      showSuccess("บันทึกข้อมูลสำเร็จ")
    }

    setTimeout(() => {
      router.push({ name: 'home' })
    }, 800) 

  } catch (error) {
    console.error('❌ สร้างออร์เดอร์ล้มเหลว:', error)
    showErr("บันทึกข้อมูลล้มเหลว")
  }
}

</script>
