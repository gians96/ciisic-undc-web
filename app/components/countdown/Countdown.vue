<template>
  <section class="countdown-shell" aria-label="Cuenta regresiva para el VIII CIISIC 2026" aria-live="polite">
    <div class="flex items-center gap-2 text-left">
      <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-400/10 text-primary-300">
        <Icon name="heroicons:clock" class="h-4 w-4" />
      </span>
      <div>
        <p class="text-[.68rem] font-bold uppercase tracking-[.18em] text-primary-200">Cuenta regresiva</p>
        <p class="mt-0.5 text-xs text-slate-400">El VIII CIISIC comienza el 26 de octubre</p>
      </div>
    </div>

    <p v-if="hasStarted" class="mt-4 rounded-xl bg-primary-400/10 px-4 py-3 text-center font-bold text-primary-200">
      El VIII CIISIC 2026 ya comenzó.
    </p>

    <div v-else class="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
      <div v-for="unit in units" :key="unit.label" class="countdown-unit">
        <span class="countdown-value">{{ String(unit.value).padStart(2, '0') }}</span>
        <span class="countdown-label">{{ unit.label }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const EVENT_START = new Date('2026-10-26T00:00:00-05:00').getTime()

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
const hasStarted = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

const units = computed(() => [
  { label: 'Días', value: days.value },
  { label: 'Horas', value: hours.value },
  { label: 'Min', value: minutes.value },
  { label: 'Seg', value: seconds.value },
])

function updateCountdown() {
  const distance = EVENT_START - Date.now()

  if (distance <= 0) {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
    hasStarted.value = true
    if (timer) clearInterval(timer)
    return
  }

  days.value = Math.floor(distance / 86_400_000)
  hours.value = Math.floor((distance % 86_400_000) / 3_600_000)
  minutes.value = Math.floor((distance % 3_600_000) / 60_000)
  seconds.value = Math.floor((distance % 60_000) / 1_000)
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1_000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.countdown-shell { max-width: 34rem; border: 1px solid #ffffff1f; border-radius: 1rem; background: #061f3dcc; padding: .9rem; box-shadow: 0 18px 45px #020f202e; backdrop-filter: blur(16px); }
.countdown-unit { display: flex; min-width: 0; flex-direction: column; align-items: center; border: 1px solid #ffffff14; border-radius: .8rem; background: #ffffff08; padding: .65rem .3rem .55rem; }
.countdown-value { font-variant-numeric: tabular-nums; color: white; font-size: clamp(1.3rem, 3vw, 1.75rem); font-weight: 800; line-height: 1; letter-spacing: -.03em; }
.countdown-label { margin-top: .35rem; color: #94a3b8; font-size: .62rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; }
@media (min-width: 1024px) { .countdown-shell { margin-inline: 0; } }
</style>
