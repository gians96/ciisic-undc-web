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
    class="flex flex-col items-center gap-4 p-4 sm:p-6 bg-slate-800/50 rounded-lg shadow-lg border border-slate-700 backdrop-blur-sm"
  >
    <h2 class="text-xl sm:text-2xl lg:text-2xl font-bold text-white text-center">
      ⏳ Faltan para el Congreso
    </h2>
    <div class="flex gap-3 sm:gap-4 text-center">
      <div class="flex flex-col items-center">
        <span class="block text-4xl sm:text-5xl lg:text-5xl font-bold text-green-400">{{ days }}</span>
        <span class="text-gray-300 text-sm sm:text-base">Días</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="block text-4xl sm:text-5xl lg:text-5xl font-bold text-green-400">{{ hours }}</span>
        <span class="text-gray-300 text-sm sm:text-base">Horas</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="block text-4xl sm:text-5xl lg:text-5xl font-bold text-green-400">{{ minutes }}</span>
        <span class="text-gray-300 text-sm sm:text-base">Min</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="block text-4xl sm:text-5xl lg:text-5xl font-bold text-green-400">{{ seconds }}</span>
        <span class="text-gray-300 text-sm sm:text-base">Seg</span>
      </div>
    </div>
  </div>
</template>