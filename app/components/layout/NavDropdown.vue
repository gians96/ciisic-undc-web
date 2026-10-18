<!-- Desplegable del menú de escritorio (Congreso, Ponencias, Semana Sistémica). Se abre y se cierra con clic o con el
     teclado (Enter/Espacio); Esc, clic fuera o salir del menú con el foco también lo cierran. -->
<template>
  <div ref="raiz" class="relative" @focusout="alSalirFoco">
    <button
      type="button"
      class="nav-link inline-flex items-center gap-1"
      :class="{ 'is-active': activo }"
      aria-haspopup="true"
      :aria-controls="idMenu"
      :aria-expanded="abierto"
      @click="alternar"
    >
      {{ etiqueta }}
      <Icon
        name="heroicons:chevron-down"
        class="h-4 w-4 transition-transform duration-200"
        :class="{ 'rotate-180': abierto }"
        aria-hidden="true"
      />
    </button>
    <Transition name="dropdown">
      <div v-show="abierto" class="absolute left-0 top-full z-50 pt-3">
        <ul
          :id="idMenu"
          class="w-72 rounded-xl border border-white/10 bg-[#041d39]/95 p-2 shadow-xl shadow-black/40 backdrop-blur-xl"
        >
          <li v-for="item in items" :key="item.href">
            <NuxtLink :to="item.href" class="submenu-link" @click="cerrar()">
              <Icon :name="item.icon" class="h-5 w-5 shrink-0 text-primary-400" aria-hidden="true" />
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface ItemDesplegable {
  label: string
  href: string
  icon: string
}

const props = defineProps<{
  /** Identificador estable del menú (se usa en `aria-controls`). */
  id: string
  etiqueta: string
  items: readonly ItemDesplegable[]
  /** La ruta actual es una de las páginas del menú. */
  activo: boolean
}>()

const route = useRoute()

const abierto = ref(false)
const raiz = ref<HTMLElement | null>(null)
const idMenu = computed(() => `menu-${props.id}`)

const cerrar = (devolverFoco = false) => {
  abierto.value = false
  if (devolverFoco) raiz.value?.querySelector('button')?.focus()
}

const alternar = () => {
  abierto.value = !abierto.value
}

const alSalirFoco = (event: FocusEvent) => {
  if (!raiz.value?.contains(event.relatedTarget as Node | null)) abierto.value = false
}

const alHacerClicFuera = (event: MouseEvent) => {
  if (abierto.value && !raiz.value?.contains(event.target as Node)) cerrar()
}

const alPulsarTecla = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && abierto.value) cerrar(true)
}

watch(() => route.path, () => cerrar())

onMounted(() => {
  document.addEventListener('click', alHacerClicFuera)
  document.addEventListener('keydown', alPulsarTecla)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', alHacerClicFuera)
  document.removeEventListener('keydown', alPulsarTecla)
})
</script>

<style scoped>
.nav-link {
  white-space: nowrap;
  color: #cbd5e1;
  font-weight: 600;
  letter-spacing: 0.01em;
  /* Igual que los demás items del menú (default.vue): compacto bajo 1280 px. */
  font-size: 0.8125rem;
  transition: all 0.3s ease;
  position: relative;
}

@media (min-width: 1280px) {
  .nav-link {
    font-size: 0.875rem;
  }
}

.nav-link:hover {
  color: #00d9e8;
}

.nav-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #00d9e8;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.is-active::after {
  width: 100%;
}

.nav-link.is-active {
  color: #00d9e8;
}

.nav-link:focus-visible {
  outline: 2px solid #00d9e8;
  outline-offset: 4px;
  border-radius: 0.25rem;
}

.submenu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-radius: 0.5rem;
  padding: 0.65rem 0.75rem;
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.submenu-link:hover,
.submenu-link:focus-visible {
  background-color: rgb(255 255 255 / 0.07);
  color: #00d9e8;
  outline: none;
}

.submenu-link.router-link-exact-active {
  background-color: rgb(0 217 232 / 0.1);
  color: #00d9e8;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active,
  .dropdown-leave-active,
  .submenu-link {
    transition: none;
  }
}
</style>
