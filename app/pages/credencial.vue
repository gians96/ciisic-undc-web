<!-- Credencial vertical del asistente: efecto 3D tipo ticket (miduConf)
     con selector de tecnologías; el color principal cambia según la
     tecnología elegida. Catálogo en app/data/tecnologias.ts. -->
<template>
  <div class="min-h-screen">
    <section class="relative overflow-hidden py-16 lg:py-24">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"/>

      <div class="custom-container relative">
        <div class="mx-auto max-w-3xl text-center">
          <p class="kicker">Credencial de asistente</p>
          <h1 class="mt-3 text-4xl font-bold tracking-tight text-white lg:text-5xl">
            Tu acceso al <span class="text-primary-300">VIII CIISIC 2026</span>
          </h1>
          <p class="mt-4 text-lg text-slate-300">
            Credencial vertical con efecto 3D. Elige tus tecnologías: el color
            de la credencial se adapta a la primera de la lista.
          </p>
        </div>

        <div class="mt-14 grid items-start gap-12 lg:grid-cols-[auto_1fr]">
          <div class="justify-self-center lg:justify-self-start">
            <CredencialVertical
              :tecnologias="seleccion"
              :asistente="ASISTENTE_DEMO"
            />
          </div>

          <div class="w-full max-w-xl">
            <div class="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm lg:p-8">
              <h2 class="text-lg font-bold text-white">Tecnologías</h2>
              <p class="mt-1 text-sm text-slate-400">
                Toca una tecnología para agregarla o quitarla. Al agregarla
                pasa a ser la principal (define el color de la credencial).
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
                  <Icon :name="tech.icono" class="h-4 w-4" />
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

            <div class="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <h2 class="text-sm font-bold uppercase tracking-widest text-primary-300">
                Asistente (demo)
              </h2>
              <dl class="mt-3 space-y-2 text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Nombre</dt>
                  <dd class="text-right font-semibold text-white">{{ ASISTENTE_DEMO.nombre }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Rol</dt>
                  <dd class="text-right text-slate-200">{{ ASISTENTE_DEMO.rol }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-slate-400">Código</dt>
                  <dd class="font-mono text-slate-200">{{ ASISTENTE_DEMO.codigo }}</dd>
                </div>
              </dl>
              <p class="mt-4 text-xs leading-relaxed text-slate-500">
                Datos de muestra. Cuando el backend publique la credencial
                (contrato pendiente), aquí llegarán los datos reales del
                registro y las tecnologías administradas desde el panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  TECNOLOGIAS,
  tecnologiaPorId,
  textoSobreColor,
} from "~/data/tecnologias";

useSeoMeta({
  title: "Credencial | VIII CIISIC 2026",
  description:
    "Credencial vertical 3D del asistente al VIII CIISIC 2026 con sus tecnologías.",
});

const ASISTENTE_DEMO = {
  nombre: "Andrea Ruiz Salas",
  rol: "Estudiante de Ingeniería de Sistemas · UNDC",
  codigo: "CIISIC-26-0042",
};

/** Selección activa: el primer id manda el color. */
const seleccion = ref<string[]>(["vue", "claude", "chatgpt"]);

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
