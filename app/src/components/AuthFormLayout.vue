<template>
  <v-container fluid class="auth-container fill-height pa-0">
    <v-row no-gutters class="fill-height">
      <!-- Left Logo Panel -->
      <v-col cols="12" md="6" class="d-none d-md-flex auth-left align-center justify-center">
        <div class="branding-container">
          <div class="brand-icon">
            <v-icon size="80" color="gold">mdi-spa</v-icon>
          </div>
          <h1 class="brand-title">Chi Brows</h1>
          <p class="brand-subtitle">THE PROFESSIONAL EYEBROWS</p>
          <div class="brand-features">
            <div class="feature-item">
              <v-icon color="gold" size="20">mdi-check-circle</v-icon>
              <span>Professional Service</span>
            </div>
            <div class="feature-item">
              <v-icon color="gold" size="20">mdi-check-circle</v-icon>
              <span>Expert Technicians</span>
            </div>
            <div class="feature-item">
              <v-icon color="gold" size="20">mdi-check-circle</v-icon>
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Right Form Panel -->
      <v-col
        cols="12"
        md="6"
        class="auth-right d-flex align-center justify-center"
      >
        <v-card class="auth-form-card" elevation="0">
          <div class="form-header">
            <h2 class="form-title">{{ title }}</h2>
            <p class="form-subtitle">{{ subtitle }}</p>
          </div>

          <div class="auth-form">
            <slot name="form" />
          </div>

          <div class="form-footer" v-if="$slots.footer">
            <v-divider class="my-6" />
            <slot name="footer" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.auth-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.auth-left {
  background: linear-gradient(135deg, #8b2e2e 0%, #a64545 50%, #8b2e2e 100%);
  position: relative;
  overflow: hidden;
}

.auth-left::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.branding-container {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
}

.brand-icon {
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.brand-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -1px;
}

.brand-subtitle {
  font-size: 1rem;
  letter-spacing: 2px;
  color: rgba(255, 215, 0, 0.8);
  margin-bottom: 3rem;
  font-weight: 300;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 0.95rem;
  opacity: 0.9;
}

.auth-right {
  background: white;
  padding: 2rem;
}

.auth-form-card {
  width: 100%;
  max-width: 450px;
  padding: 3rem 2.5rem;
  border-radius: 20px;
  background: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.form-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
}

.form-footer {
  text-align: center;
}

/* Global styles for form elements inside this component */
:deep(.form-group) {
  margin-bottom: 1.5rem;
  animation: slideUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

:deep(.form-group:nth-child(1)) { animation-delay: 0.1s; }
:deep(.form-group:nth-child(2)) { animation-delay: 0.2s; }
:deep(.form-group:nth-child(3)) { animation-delay: 0.3s; }
:deep(.form-group:nth-child(4)) { animation-delay: 0.4s; }
:deep(.form-group:nth-child(5)) { animation-delay: 0.5s; }

:deep(.form-input .v-field) {
  border-radius: 12px;
  background: #f8f9fa;
}

:deep(.form-input .v-field--focused) {
  background: white;
}

:deep(.auth-btn) {
  height: 56px;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #8b2e2e 0%, #a64545 100%);
  text-transform: none;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
  animation: slideUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: 0.6s;
}

:deep(.auth-btn:hover) {
  background: linear-gradient(135deg, #7a2626 0%, #953d3d 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 46, 46, 0.3);
}

:deep(.form-options) {
  margin-bottom: 2rem;
  animation: slideUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: 0.5s;
}

:deep(.register-text) {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0;
}

:deep(.register-link) {
  color: #8b2e2e;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

:deep(.register-link:hover) {
  color: #a64545;
  text-decoration: underline;
}

/* Mobile Responsive */
@media (max-width: 960px) {
  .auth-container {
    background: white;
  }
  
  .auth-form-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
    max-width: none;
  }
  
  .form-title {
    font-size: 1.75rem;
  }
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 