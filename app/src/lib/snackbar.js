// Snackbar handler for global use
let snackbarInstance = null

export function registerSnackbar(instance) {
  snackbarInstance = instance
}

export function showSnackbar(message, type = 'info', duration = 3000) {
  snackbarInstance?.show(message, type, duration)
}

export function showSuccess(message, duration = 3000) {
  showSnackbar(message, 'success', duration)
}

export function showErr(message, duration = 3000) {
  showSnackbar(message, 'error', duration)
} 