<template>
  <v-container fluid>
    <h1 class="text-h5 mb-4">รายชื่อลูกค้า</h1>

    <!-- 🔍 ฟอร์มกรอง -->
    <v-row justify="center">
      <v-col cols="12">
        <v-card class="pa-4 mx-auto" outlined>
          <v-card-title>ค้นหาลูกค้า</v-card-title>

          <v-text-field
            label="ค้นหาจากชื่อ, เบอร์, ไลน์, Facebook"
            v-model="searchText"
            variant="outlined"
            density="compact"
            :loading="loading"
            clearable
          />

          <v-card-actions class="justify-end mt-4">
            <v-btn class="next-button" @click="submitSearch" :loading="loading">
              ค้นหา
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 📋 ตารางผลลัพธ์ -->
    <v-row justify="center" class="mt-5">
      <v-col cols="12">
        <v-table class="elevation-1 bordered-table">
          <thead>
            <tr>
              <th class="text-center">ชื่อ</th>
              <th class="text-center">อีเมล</th>
              <th class="text-center">เบอร์โทร</th>
              <th class="text-center"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.id">
              <td class="text-center">{{ customer.fullname }}</td>
              <td class="text-center">{{ customer.facebook }}</td>
              <td class="text-center">{{ customer.tel }}</td>
              <td class="text-center">
                <v-btn
                  color="primary"
                  class="text-white"
                  height="36"
                  width="120"
                  @click="viewDetails(customer)"
                >
                  ดูรายละเอียด
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { searchCustomers } from "@/services/customerService";

const router = useRouter();

const searchText = ref("");
const customers = ref([]);
const loading = ref(false);

async function fetchCustomers(query = "") {
  loading.value = true;
  try {
    const res = await searchCustomers(query);
    customers.value = res.items;
  } catch (err) {
    console.error("❌ โหลดข้อมูลลูกค้าไม่สำเร็จ:", err);
    customers.value = [];
  } finally {
    loading.value = false;
  }
}

function submitSearch() {
  fetchCustomers(searchText.value || "");
}

// ✅ เรียกตอนเข้า
onMounted(() => {
  fetchCustomers("");
});

// ✅ กดปุ่มเพื่อ navigate ไปหน้า PrefillCustomer/:id
function viewDetails(customer) {
  router.push(`/PrefillCustomer/${customer.id}`);
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

::v-deep(.bordered-table th),
::v-deep(.bordered-table td) {
  border: 1px solid #ddd;
  text-align: center;
  vertical-align: middle;
  padding: 12px;
}

::v-deep(.bordered-table thead th) {
  background-color: #f5f5f5;
  font-weight: bold;
}
</style>
