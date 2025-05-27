<template>
  <v-row justify="center">
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
          <tr v-for="customer in store.filteredCustomers" :key="customer.id">
            <td class="text-center">{{ customer.name }}</td>
            <td class="text-center">{{ customer.email }}</td>
            <td class="text-center">{{ customer.phone }}</td>
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
</template>

<script setup>
import { useCustomerStore } from '../../stores/customer'

const store = useCustomerStore()

function viewDetails(customer) {
  alert(
    `รายละเอียดลูกค้า:\n\nชื่อ: ${customer.name}\nอีเมล: ${customer.email}\nโทร: ${customer.phone}`
  )
}
</script>

<style scoped>
/* ปรับสไตล์ของตาราง */
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
