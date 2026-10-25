<!-- Credencial 3D con datos reales: la abre el enlace del correo de aprobación
     (/credencial/<codigo>, spec 020). El menú «⋮ → Editar» permite elegir las
     tecnologías; la selección se guarda en este dispositivo (localStorage). -->
<template>
  <div class="min-h-screen">
    <section class="relative overflow-hidden py-16 lg:py-24">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"/>

      <div class="custom-container relative">
        <div
          v-if="cargando"
          class="mx-auto max-w-3xl py-24 text-center"
          aria-live="polite"
        >
          <p class="kicker">Credencial de asistente</p>
          <p class="mt-4 text-lg text-slate-300">Cargando tu credencial…</p>
        </div>

        <div v-else-if="!datos" class="mx-auto max-w-2xl py-16 text-center">
          <p class="kicker">Credencial de asistente</p>
          <h1 class="mt-3 text-3xl font-bold tracking-tight text-white">
            No pudimos mostrar tu credencial
          </h1>
          <p class="mt-4 text-slate-300">{{ mensajeFalla }}</p>
          <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              v-if="reintentable"
              type="button"
              class="boton-primario"
              @click="recargar"
            >
              Reintentar
            </button>
            <NuxtLink to="/" class="boton-secundario">Volver al inicio</NuxtLink>
          </div>
        </div>

        <template v-else>
          <div class="mx-auto max-w-3xl text-center">
            <p class="kicker">Credencial de asistente</p>
            <h1 class="mt-3 text-4xl font-bold tracking-tight text-white lg:text-5xl">
              Tu acceso al
              <span class="text-primary-300">{{ datos.evento.nombreCorto }}</span>
            </h1>
            <p class="mt-4 text-lg text-slate-300">
              Credencial digital con tu código de registro y el mismo formato
              que tu credencial impresa.
            </p>
          </div>

          <div class="mt-14 grid items-start gap-12 lg:grid-cols-[auto_1fr]">
            <div class="justify-self-center lg:justify-self-start">
              <CredencialVertical
                :tecnologias="seleccion"
                :asistente="asistente"
              />
            </div>

            <div class="w-full max-w-xl space-y-6">
              <div
                class="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm lg:p-8"
              >
                <div class="relative flex items-start justify-between gap-4">
                  <div>
                    <h2 class="text-lg font-bold text-white">Tu credencial</h2>
                    <p class="mt-1 text-sm text-slate-400">
                      Los mismos datos que se imprimen en tu credencial.
                    </p>
                  </div>

                  <button
                    type="button"
                    class="boton-menu"
                    aria-haspopup="menu"
                    :aria-expanded="menuAbierto"
                    aria-label="Opciones de la credencial"
                    @click="menuAbierto = !menuAbierto"
                  >
                    <Icon name="heroicons:ellipsis-vertical" class="h-5 w-5"/>
                  </button>

                  <div
                    v-if="menuAbierto"
                    role="menu"
                    class="menu-opciones"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      class="menu-opciones__item"
                      @click="alternarEditor"
                    >
                      <Icon name="heroicons:pencil-square" class="h-4 w-4"/>
                      {{ editando ? "Listo" : "Editar" }}
                    </button>
                  </div>
                </div>

                <dl class="mt-5 space-y-2 text-sm">
                  <div class="flex justify-between gap-4">
                    <dt class="text-slate-400">Nombre</dt>
                    <dd class="text-right font-semibold text-white">{{ asistente.nombre }}</dd>
                  </div>
                  <div class="flex justify-between gap-4">
                    <dt class="text-slate-400">Rol</dt>
                    <dd class="text-right text-slate-200">{{ asistente.rol }}</dd>
                  </div>
                  <div class="flex justify-between gap-4">
                    <dt class="text-slate-400">Código</dt>
                    <dd class="font-mono text-slate-200">{{ asistente.codigo }}</dd>
                  </div>
                </dl>
              </div>

              <div
                v-if="editando"
                class="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
              >
                <h2 class="text-lg font-bold text-white">Tecnologías</h2>
                <p class="mt-1 text-sm text-slate-400">
                  Toca una tecnología para agregarla o quitarla. Al agregarla
                  pasa a ser la principal (define el color de la credencial).
                  Tu elección queda guardada en este dispositivo.
                </p>

                <div class="mt-5 flex flex-wrap gap-2.5">
                  <button
                    v-for="tech in TECNOLOGIAS"
                    :key="tech.id"
                    type="button"
                    class="tech-chip"
                    :class="{ 'tech-chip--activa': seleccion.includes(tech.id) }"
                    :style="seleccion.includes(tech.id) ? { background: tech.color, borderColor: tech.color, color: textoSobreColor(tech.color) } : undefined"
                    :aria-pressed="seleccion.includes(tech.id)"
                    @click="alternar(tech.id)"
                  >
                    <Icon :name="tech.icono" class="h-4 w-4"/>
                    {{ tech.nombre }}
                    <span
                      v-if="seleccion[0] === tech.id"
                      class="tech-chip__principal"
                      title="Color principal"
                    >●</span>
                  </button>
                </div>

                <div v-if="seleccion.length" class="mt-6 flex items-center gap-3">
                  <span class="text-sm text-slate-400">Color principal:</span>
                  <span
                    class="h-5 w-5 rounded-full ring-2 ring-white/30"
                    :style="{ background: colorPrincipal }"
                    aria-hidden="true"
                  />
                  <code class="text-xs text-slate-500">{{ colorPrincipal }}</code>
                </div>
                <p v-else class="mt-6 text-sm text-amber-300/90">
                  Sin tecnología seleccionada: la credencial usa el color por
                  defecto del congreso.
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>

    <button
      v-if="menuAbierto"
      type="button"
      class="fixed inset-0 z-30 cursor-default"
      aria-label="Cerrar el menú"
      @click="menuAbierto = false"
    />
  </div>
</template>

<script setup lang="ts">
import { normalizeApiError } from "~/composables/useApi";
import { TECNOLOGIAS, tecnologiaPorId, textoSobreColor } from "~/data/tecnologias";
import type { ApiExito } from "~/types/evento";
import {
  guardarTecnologias,
  mensajeCredencial,
  nombreCompleto,
  rolDeCredencial,
  tecnologiasGuardadas,
  type DatosCredencial,
} from "~/utils/credencial";
import { rutasSitio } from "~/utils/rutas-sitio";

const ruta = useRoute();
const codigo = computed(() => String(ruta.params.codigo ?? "").trim().toUpperCase());

const { request } = useApi();
const { data, status, error, refresh } = useAsyncData(
  "credencial",
  () =>
    request<ApiExito<DatosCredencial>>(rutasSitio.credencial(codigo.value)).then(
      (respuesta) => respuesta?.data ?? null,
    ),
  { watch: [codigo] },
);

const datos = computed(() => data.value ?? null);
const cargando = computed(() => status.value === "pending");
const fallo = computed(() => (error.value ? normalizeApiError(error.value) : null));
const mensajeFalla = computed(() => (fallo.value ? mensajeCredencial(fallo.value) : ""));
const reintentable = computed(() => {
  const estado = fallo.value?.statusCode ?? 500;
  return estado === 0 || estado >= 500;
});
const recargar = () => { void refresh() };

useSeoMeta({
  title: () =>
    datos.value
      ? `Credencial | ${datos.value.evento.nombreCorto}`
      : "Credencial | VIII CIISIC 2026",
  description:
    "Credencial digital 3D del congreso con tu nombre, tu rol y tu código de registro.",
});

const asistente = computed(() => ({
  nombre: datos.value ? nombreCompleto(datos.value) : "",
  rol: datos.value ? rolDeCredencial(datos.value) : "",
  codigo: datos.value?.codigo ?? codigo.value,
}));

/** Selección activa: el primer id manda el color. Vive en localStorage por código. */
const seleccion = ref<string[]>([]);
const editando = ref(false);
const menuAbierto = ref(false);
const enCliente = ref(false);

onMounted(() => {
  enCliente.value = true;
  seleccion.value = tecnologiasGuardadas(codigo.value, window.localStorage);
});

watch(codigo, () => {
  if (enCliente.value) seleccion.value = tecnologiasGuardadas(codigo.value, window.localStorage);
});

const colorPrincipal = computed(
  () => tecnologiaPorId(seleccion.value[0] ?? "")?.color ?? "#00d9e8",
);

function alternar(id: string) {
  const i = seleccion.value.indexOf(id);
  if (i >= 0) {
    seleccion.value.splice(i, 1);
  } else {
    // Al agregar, pasa al frente: cambia el color principal al instante.
    seleccion.value.unshift(id);
  }
  if (enCliente.value) guardarTecnologias(codigo.value, seleccion.value, window.localStorage);
}

function alternarEditor() {
  editando.value = !editando.value;
  menuAbierto.value = false;
}
</script>

<style scoped>
.kicker {
  color: #67e8f9;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.boton-primario {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: #00d9e8;
  padding: 0.7rem 1.6rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #041d39;
  transition: transform 0.15s ease;
}

.boton-primario:hover {
  transform: translateY(-1px);
}

.boton-secundario {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  padding: 0.7rem 1.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
}

.boton-menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.45rem;
  color: #cbd5e1;
}

.boton-menu:focus-visible {
  outline: 2px solid #00d9e8;
  outline-offset: 2px;
}

.menu-opciones {
  position: absolute;
  top: 2.75rem;
  right: 0;
  z-index: 40;
  min-width: 10rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 0.75rem;
  background: #06203c;
  box-shadow: 0 18px 40px rgba(1, 8, 18, 0.55);
}

.menu-opciones__item {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  text-align: left;
}

.menu-opciones__item:hover {
  background: rgba(255, 255, 255, 0.08);
}

.menu-opciones__item:focus-visible {
  outline: 2px solid #00d9e8;
  outline-offset: -2px;
}

.tech-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 0.95rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}

.tech-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.4);
}

.tech-chip:focus-visible {
  outline: 2px solid #00d9e8;
  outline-offset: 2px;
}

.tech-chip--activa {
  box-shadow: 0 8px 20px rgba(1, 8, 18, 0.4);
}

.tech-chip__principal {
  font-size: 0.6rem;
  line-height: 1;
}
</style>
