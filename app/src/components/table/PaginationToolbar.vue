<template>
  <div v-if="totalPages > 1" class="d-flex justify-center mt-4">
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      @input="onPageChange"
      color="primary"
      total-visible="7"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const currentPage = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val),
})

function onPageChange(val) {
  emit('update:modelValue', val) // ให้ v-model อัปเดตทันที
  emit('change', val) // แจ้ง parent โหลดข้อมูลใหม่
}
</script>

<style scoped>
/* You can style pagination bar here if needed */
</style>
