<template>
  <Transition name="notification" mode="out-in">
    <div v-if="errorMessage" class="notification error-notification">
      <div class="notification-content">
        <Icon name="heroicons:exclamation-circle" class="notification-icon" />
        <span>{{ errorMessage }}</span>
      </div>
      <button @click="clearError" class="notification-close">
        <Icon name="heroicons:x-mark" class="h-5 w-5" />
      </button>
    </div>
    <div v-else-if="successMessage" class="notification success-notification">
      <div class="notification-content">
        <Icon name="heroicons:check-circle" class="notification-icon" />
        <span>{{ successMessage }}</span>
      </div>
      <button @click="clearSuccess" class="notification-close">
        <Icon name="heroicons:x-mark" class="h-5 w-5" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  errorMessage?: string
  successMessage?: string
}

interface Emits {
  (e: 'clear-error'): void
  (e: 'clear-success'): void
}

const props = withDefaults(defineProps<Props>(), {
  errorMessage: '',
  successMessage: ''
})

const emit = defineEmits<Emits>()

const clearError = () => {
  emit('clear-error')
}

const clearSuccess = () => {
  emit('clear-success')
}
</script>

<style scoped>
/* Notification System */
.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 50;
  min-width: 320px;
  max-width: 400px;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: between;
  gap: 0.75rem;
}

.error-notification {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.success-notification {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.notification-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.notification-close {
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
}

.error-notification .notification-close {
  color: #dc2626;
}

.error-notification .notification-close:hover {
  background-color: #fecaca;
}

.success-notification .notification-close {
  color: #16a34a;
}

.success-notification .notification-close:hover {
  background-color: #bbf7d0;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive notifications */
@media (max-width: 640px) {
  .notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: none;
  }
}
</style>