<template>
  <transition name="fade">
    <div v-if="visible" :class="['snackbar', type]">
      <v-icon class="icon">{{ iconName }}</v-icon>
      <span class="message">{{ message }}</span>
      <button class="close-btn" @click="close" aria-label="Close">&times;</button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('info')
let timeoutId = null

const iconName = computed(() => {
  switch (type.value) {
    case 'success': return 'mdi-check-circle'
    case 'error': return 'mdi-alert-circle'
    case 'info': return 'mdi-information'
    default: return 'mdi-information'
  }
})

function show(msg, msgType = 'info', duration = 3000) {
  message.value = msg
  type.value = msgType
  visible.value = true
  if (timeoutId) clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    visible.value = false
  }, duration)
}

function close() {
  visible.value = false
  if (timeoutId) clearTimeout(timeoutId)
}

// Expose show method for external use
// This will be accessed via a ref from the parent
defineExpose({ show })
</script>

<style scoped>
.snackbar {
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  min-width: 260px;
  max-width: 90vw;
  padding: 18px 32px 18px 20px;
  border-radius: 16px;
  color: #fff;
  font-size: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.10);
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 9999;
  backdrop-filter: blur(6px);
  background: rgba(30, 30, 30, 0.92);
  border: 1px solid rgba(255,255,255,0.08);
  transition: box-shadow 0.2s;
}
.snackbar.info {
  background: linear-gradient(90deg, #2196f3 80%, #1976d2 100%);
}
.snackbar.success {
  background: linear-gradient(90deg, #43e97b 80%, #38f9d7 100%);
  color: #1a3a2b;
}
.snackbar.error {
  background: linear-gradient(90deg, #f85032 80%, #e73827 100%);
}
.icon {
  font-size: 22px;
  margin-right: 4px;
  display: flex;
  align-items: center;
}
.message {
  flex: 1;
  font-weight: 500;
  letter-spacing: 0.01em;
}
.close-btn {
  background: rgba(255,255,255,0.12);
  border: none;
  color: inherit;
  font-size: 22px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.close-btn:hover {
  background: rgba(255,255,255,0.22);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 