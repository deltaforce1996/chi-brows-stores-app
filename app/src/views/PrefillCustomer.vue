<template>

  
  <v-container v-if="user">
    <!-- 🧍‍♀️ ข้อมูลผู้ใช้ -->
    <v-card class="pa-6 mb-6" outlined>
      <v-card-title class="text-red font-weight-bold">ข้อมูลผู้ใช้</v-card-title>
      <v-row class="my-6">
        <v-col cols="12" md="8">
          <v-card flat class="pa-4">
            <v-row>
              <v-col cols="12" sm="6"><strong>ชื่อ-สกุล:</strong> {{ user.fullname }}</v-col>
              <v-col cols="12" sm="6"><strong>ชื่อเล่น:</strong> {{ user.nickname }}</v-col>
              <v-col cols="12" sm="6"><strong>Facebook:</strong> {{ user.facebook }}</v-col>
              <v-col cols="12" sm="6"><strong>Line:</strong> {{ user.line }}</v-col>
              <v-col cols="12" sm="6"><strong>ที่อยู่:</strong> {{ user.address }}</v-col>
              <v-col cols="12" sm="6"><strong>เบอร์โทร:</strong> {{ user.tel }}</v-col>
              <v-col cols="12" sm="6"><strong>วันเกิด:</strong> {{ user.birthday }}</v-col>
              <v-col cols="12" sm="6"><strong>วันที่ลงทะเบียน:</strong> {{ formatDate(user.created_at) }}</v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- 📦 ประวัติการใช้บริการ -->
    <v-card class="pa-4 mt-8" outlined>
      <v-card-title class="text-h6 font-weight-bold text-primary">ประวัติการใช้บริการ</v-card-title>

      <div v-if="orders.length">
        <div v-for="(order, index) in orders" :key="order.id" class="mt-6">
          <v-divider class="mb-4" />
          <h3 class="text-subtitle-1 font-weight-bold mb-2">
            🧾 ครั้งที่ {{ index + 1 }} - รหัส: {{ order.id }}
          </h3>
          <p class="mb-2">
            <strong>สถานะ:</strong> {{ order.status }} |
            <strong>ยอดรวม:</strong> ฿{{ order.total_amount }} |
            <strong>วันที่สั่ง:</strong> {{ formatDate(order.created_at) }}
          </p>
{{  order.uploads[0]?.url}}
          <v-row>
            <v-col cols="12">
              <v-card outlined v-if="order.items.length" class="d-flex flex-row-reverse">
                <v-img
                  :src="`${order.uploads[0]?.url || ''}`"
                  width="160"
                  height="160"
                  cover
                  class="rounded-l-lg"
                />
                <div class="pa-4 flex-grow-1">
                  <div class="mb-2"><strong>รูปแบบการให้บริการ:</strong><br />{{ order.items[0]?.product?.name }}</div>
                  <div class="mb-2"><strong>โรคประจำตัว:</strong><br />{{ order.items[0]?.product?.description || "-" }}</div>
                  <div class="mb-2"><strong>ชื่อผู้ให้บริการ:</strong><br />{{ order.employee.fullname }}</div>
                  <div class="mb-2"><strong>วันที่-เวลา:</strong><br />{{ formatDate(order.created_at) }}</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>

      <v-alert v-else type="info" text class="mt-4">
        ลูกค้าท่านนี้ยังไม่มีประวัติการสั่งซื้อ
      </v-alert>
    </v-card>

    <!-- 🔴 ปุ่มเพิ่ม -->
    <v-btn color="error" class="mt-8" @click="showForm = true">เพิ่ม</v-btn>

    <!-- 📝 ฟอร์มเพิ่มข้อมูลบริการ -->
    <v-card v-if="showForm" class="pa-6 mt-6" outlined>
      <v-card-title class="text-red font-weight-bold">รายละเอียดการบริการ</v-card-title>

      <v-select
        v-model="formData.serviceType"
        :items="productOptions"
        item-title="title"
        item-value="value"
        label="รูปแบบการให้บริการ"
        outlined
        class="mb-4"
      />

      <v-text-field
        v-model="formData.condition"
        label="โรคประจำตัว"
        outlined
        class="mb-4"
      />

      <v-select
        v-model="formData.employee"
        :items="employeeOptions"
        item-title="title"
        item-value="value"
        label="ชื่อผู้ให้บริการ"
        outlined
        class="mb-4"
      />

      <v-text-field
        v-model="formData.price"
        label="ราคา"
        type="number"
        outlined
        class="mb-4"
      />

      <v-text-field
        v-model="formData.datetime"
        label="วันที่ - เวลา"
        type="datetime-local"
        outlined
        class="mb-4"
      />

      <v-card class="pa-4 mt-4" outlined>
        <v-card-title class="text-red font-weight-bold">เพิ่มรูปภาพ</v-card-title>
        <v-file-input
          v-model="formData.image"
          label="Browse Files to upload"
          prepend-icon="mdi-cloud-upload"
          outlined
          show-size
          accept="image/*"
        />
      </v-card>

      <v-row class="mt-6" justify="end">
        <v-btn color="grey" @click="cancelForm" class="mr-4">ยกเลิก</v-btn>
        <v-btn color="primary" @click="submitForm" :loading="loading">บันทึก</v-btn>
      </v-row>
    </v-card>
  </v-container>

  <v-container v-else>
    <v-alert type="error" text>ไม่พบข้อมูลผู้ใช้</v-alert>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { searchOrders, createOrder, uploadOrderImage } from '@/services/orderService'
import { searchEmployees } from '@/services/employeeService'
import { searchProducts } from '@/services/productService'

const route = useRoute()
const user = ref(null)
const orders = ref([])
const showForm = ref(false)
const loading = ref(false)

const employeeOptions = ref([])
const productOptions = ref([])

const formData = ref({
  serviceType: '',
  condition: '',
  employee: '',
  price: '',
  datetime: '',
  image: null,
})

onMounted(async () => {
  const customerId = route.params.id

  try {
    const res = await searchOrders({ customerId }, 1, 100)
    orders.value = res.items || []
    user.value = orders.value[0]?.customer || null
  } catch (err) {
    console.error('❌ ไม่สามารถโหลดข้อมูลลูกค้า:', err)
    user.value = null
  }

  try {
    const res = await searchEmployees({}, 1, 100)
    employeeOptions.value = res.items.map(emp => ({ title: emp.fullname, value: emp.id }))
  } catch (err) {
    console.error('❌ โหลดพนักงานไม่สำเร็จ:', err)
  }

  try {
    const res = await searchProducts('')
    productOptions.value = res.map(prod => ({ title: prod.name, value: prod.id }))
  } catch (err) {
    console.error('❌ โหลดบริการไม่สำเร็จ:', err)
  }
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return isNaN(d.getTime())
    ? 'ไม่พบวันที่'
    : d.toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })
}

function cancelForm() {
  showForm.value = false
  formData.value = {
    serviceType: '',
    condition: '',
    employee: '',
    price: '',
    datetime: '',
    image: null,
  }
}

async function submitForm() {
  loading.value = true
  try {
    const customerId = route.params.id

    // ✅ validate วันที่ก่อนใช้
    const rawDate = formData.value.datetime
    if (!rawDate || isNaN(new Date(rawDate).getTime())) {
      alert('⏰ กรุณาระบุวันที่และเวลาให้ถูกต้อง')
      loading.value = false
      return
    }

    const payload = {
      customerId,
      employeeId: formData.value.employee,
      items: [
        {
          productId: formData.value.serviceType,
          quantity: 1,
        },
      ],
      notes: formData.value.condition || '',
      price: Number(formData.value.price),
      date: new Date(rawDate).toISOString(),
    }

    const response = await createOrder(payload)
        console.log("11111111", response.id)
    const orderId = response?.id
    // console.log("")

    if (orderId) {
      // 📤 Upload image ถ้ามี
      if (formData.value.image) {
        await uploadOrderImage(orderId, formData.value.image)
      }

      alert('บันทึกข้อมูลเรียบร้อยแล้ว ✅')
      cancelForm()

      const res = await searchOrders({ customerId }, 1, 100)
      orders.value = res.items || []
    } else {
      alert('บันทึกไม่สำเร็จ ❌')
    }

  } catch (err) {
    console.error('❌ SubmitForm Error:', err)
    alert('เกิดข้อผิดพลาดในการบันทึก ❌')
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.rounded-lg {
  border-radius: 12px;
}
.rounded-b-lg {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>
