<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const targetDate = new Date("2025-10-20T00:00:00").getTime();
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

let timer;

const updateCountdown = () => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    days.value = hours.value = minutes.value = seconds.value = 0;
    clearInterval(timer);
    return;
  }

  days.value = Math.floor(distance / (1000 * 60 * 60 * 24));
  hours.value = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((distance % (1000 * 60)) / 1000);
};

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div
    class="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
  >
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
      ⏳ Faltan para el Congreso
    </h2>
    <div class="flex gap-4 text-center">
      <div>
        <span class="block text-4xl font-bold text-primary">{{ days }}</span>
        <span class="text-gray-600 dark:text-gray-300">Días</span>
      </div>
      <div>
        <span class="block text-4xl font-bold text-primary">{{ hours }}</span>
        <span class="text-gray-600 dark:text-gray-300">Horas</span>
      </div>
      <div>
        <span class="block text-4xl font-bold text-primary">{{ minutes }}</span>
        <span class="text-gray-600 dark:text-gray-300">Min</span>
      </div>
      <div>
        <span class="block text-4xl font-bold text-primary">{{ seconds }}</span>
        <span class="text-gray-600 dark:text-gray-300">Seg</span>
      </div>
    </div>
  </div>
</template>