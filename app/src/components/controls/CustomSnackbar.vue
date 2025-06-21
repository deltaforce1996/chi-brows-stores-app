<template>
  <transition name="fade">
    <div v-if="visible" :class="['snackbar', type]">
      <span class="icon-bg">
        <v-icon class="icon">{{ iconName }}</v-icon>
      </span>
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
  border-radius: 18px;
  color: #fff;
  font-size: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.10);
  display: flex;
  align-items: center;
  gap: 18px;
  z-index: 9999;
  backdrop-filter: blur(10px);
  background: rgba(34, 40, 49, 0.85);
  border: 1px solid rgba(255,255,255,0.10);
  transition: box-shadow 0.2s, background 0.2s;
}
.snackbar.info {
  background: linear-gradient(90deg, rgba(33,150,243,0.92) 80%, rgba(25,118,210,0.92) 100%);
}
.snackbar.success {
  background: linear-gradient(90deg, rgba(67,233,123,0.92) 80%, rgba(56,249,215,0.92) 100%);
  color: #1a3a2b;
}
.snackbar.error {
  background: linear-gradient(90deg, rgba(248,80,50,0.92) 80%, rgba(231,56,39,0.92) 100%);
}
.icon-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--icon-bg, #2196f3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
}
.snackbar.info .icon-bg { --icon-bg: #2196f3; }
.snackbar.success .icon-bg { --icon-bg: #43e97b; }
.snackbar.error .icon-bg { --icon-bg: #f85032; }
.icon {
  font-size: 22px;
  color: #fff;
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