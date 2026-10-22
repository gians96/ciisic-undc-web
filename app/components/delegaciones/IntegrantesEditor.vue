<template>
  <div ref="raiz" class="space-y-4">
    <ul class="space-y-4">
      <li v-for="(fila, indice) in filas" :key="fila.clave" class="del-fila">
        <div class="flex items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-xs font-bold uppercase tracking-[.18em] text-primary-300">Integrante {{ indice + 1 }}</p>
            <span v-if="planUnico" class="del-chip">{{ ETIQUETA_PLAN[planUnico] }}</span>
          </div>
          <button
            v-if="filas.length > 1 || !filaEnBlanco(fila)"
            type="button"
            class="del-quitar"
            :aria-label="`Quitar al integrante ${indice + 1}`"
            @click="quitar(fila.clave)"
          >
            <Icon name="heroicons:trash" class="h-4 w-4" aria-hidden="true" />
            <span class="hidden sm:inline">Quitar</span>
          </button>
        </div>

        <div class="mt-3 grid gap-x-4 gap-y-4 md:grid-cols-12">
          <div class="md:col-span-4">
            <label :for="`int-doc-${fila.clave}`" class="del-label">Documento</label>
            <div class="del-grupo">
              <select v-model="fila.tipoDocumento" class="del-campo del-tipo" aria-label="Tipo de documento" @change="fila.aviso = ''">
                <option value="dni">DNI</option>
                <option value="ce">CE</option>
              </select>
              <input
                :id="`int-doc-${fila.clave}`"
                v-model="fila.numeroDocumento"
                class="del-campo"
                maxlength="12"
                :inputmode="fila.tipoDocumento === 'dni' ? 'numeric' : 'text'"
                :placeholder="fila.tipoDocumento === 'dni' ? '8 dígitos' : 'Número de CE'"
                autocomplete="off"
                :aria-invalid="Boolean(errores[fila.clave]?.numeroDocumento)"
                @input="alEscribir(fila)"
                @blur="alSalir(fila)"
                @keydown.enter.prevent="alPulsarEnter(fila)"
              >
            </div>
            <p v-if="errores[fila.clave]?.numeroDocumento" class="del-error" role="alert">{{ errores[fila.clave]?.numeroDocumento }}</p>
            <p v-else-if="fila.buscando" class="mt-1.5 flex items-center gap-1.5 text-xs text-slate-300" role="status">
              <Icon name="heroicons:arrow-path" class="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> Consultando el DNI…
            </p>
            <p v-else-if="fila.aviso" class="mt-1.5 text-xs text-amber-200" role="status">{{ fila.aviso }}</p>
          </div>

          <div class="md:col-span-4">
            <label :for="`int-nom-${fila.clave}`" class="del-label">Nombres</label>
            <input :id="`int-nom-${fila.clave}`" v-model="fila.nombres" class="del-campo" maxlength="120" autocomplete="off" :aria-invalid="Boolean(errores[fila.clave]?.nombres)">
            <p v-if="errores[fila.clave]?.nombres" class="del-error" role="alert">{{ errores[fila.clave]?.nombres }}</p>
          </div>

          <div class="md:col-span-4">
            <label :for="`int-ape-${fila.clave}`" class="del-label">Apellidos</label>
            <input :id="`int-ape-${fila.clave}`" v-model="fila.apellidos" class="del-campo" maxlength="120" autocomplete="off" :aria-invalid="Boolean(errores[fila.clave]?.apellidos)">
            <p v-if="errores[fila.clave]?.apellidos" class="del-error" role="alert">{{ errores[fila.clave]?.apellidos }}</p>
          </div>

          <div class="md:col-span-8">
            <label :for="`int-cor-${fila.clave}`" class="del-label">
              Correo<span v-if="dominio" class="font-normal text-slate-400"> institucional</span>
            </label>
            <div :class="dominio ? 'del-grupo' : undefined">
              <input
                :id="`int-cor-${fila.clave}`"
                v-model="fila.correo"
                :type="dominio ? 'text' : 'email'"
                class="del-campo"
                maxlength="191"
                inputmode="email"
                autocomplete="off"
                autocapitalize="none"
                spellcheck="false"
                :placeholder="dominio ? 'usuario' : 'correo@ejemplo.com'"
                :aria-invalid="Boolean(errores[fila.clave]?.correo)"
                @blur="alSalirDelCorreo(fila)"
              >
              <span v-if="dominio" class="del-sufijo">@{{ dominio }}</span>
            </div>
            <p v-if="errores[fila.clave]?.correo" class="del-error" role="alert">{{ errores[fila.clave]?.correo }}</p>
            <p v-else-if="dominio" class="mt-1.5 text-xs text-slate-400">Escribe solo lo que va antes de la @.</p>
          </div>

          <div class="md:col-span-4">
            <label :for="`int-cel-${fila.clave}`" class="del-label">Celular <span class="font-normal text-slate-400">(opcional)</span></label>
            <input :id="`int-cel-${fila.clave}`" v-model="fila.celular" class="del-campo" maxlength="15" inputmode="tel" autocomplete="off" placeholder="987654321" :aria-invalid="Boolean(errores[fila.clave]?.celular)">
            <p v-if="errores[fila.clave]?.celular" class="del-error" role="alert">{{ errores[fila.clave]?.celular }}</p>
          </div>

          <fieldset v-if="pedirPlan" class="md:col-span-12">
            <legend class="del-label">Plan</legend>
            <div class="flex flex-wrap gap-2">
              <label v-for="plan in planes" :key="plan.codigo" class="del-plan" :class="{ activo: fila.plan === plan.codigo }">
                <input v-model="fila.plan" type="radio" :name="`int-plan-${fila.clave}`" :value="plan.codigo" class="sr-only">
                <span class="font-semibold">{{ ETIQUETA_PLAN[plan.codigo] }}</span>
                <span v-if="plan.precio !== undefined" class="text-sm text-primary-200">{{ formatearSoles(plan.precio) }}</span>
              </label>
            </div>
            <p v-if="errores[fila.clave]?.plan" class="del-error" role="alert">{{ errores[fila.clave]?.plan }}</p>
          </fieldset>
        </div>
      </li>
    </ul>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button type="button" class="btn btn-outline" :disabled="filas.length >= MAX_INTEGRANTES" @click="agregar">
        <Icon name="heroicons:user-plus" class="h-5 w-5" aria-hidden="true" /> Agregar otro integrante
      </button>
      <p class="text-sm text-slate-400">Con el DNI se completan los nombres automáticamente.</p>
    </div>

    <details class="rounded-2xl border border-white/10 bg-white/[.03] p-4">
      <summary class="cursor-pointer text-sm font-semibold text-slate-200">¿Tienes la lista en Excel? Pégala aquí</summary>
      <p class="mt-2 text-xs text-slate-400">
        Una persona por línea: <span class="font-mono">DNI, Nombres, Apellidos, Correo, Celular</span> (también acepta tabulador o punto y coma).
        <template v-if="dominio"> Los correos deben ser <span class="font-mono">@{{ dominio }}</span>.</template>
      </p>
      <fieldset v-if="pedirPlan" class="mt-3">
        <legend class="del-label">Plan de estas personas</legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="plan in planes" :key="plan.codigo" class="del-plan" :class="{ activo: planLista === plan.codigo }">
            <input v-model="planLista" type="radio" name="lista-plan" :value="plan.codigo" class="sr-only">
            <span class="font-semibold">{{ ETIQUETA_PLAN[plan.codigo] }}</span>
            <span v-if="plan.precio !== undefined" class="text-sm text-primary-200">{{ formatearSoles(plan.precio) }}</span>
          </label>
        </div>
        <p class="mt-1.5 text-xs text-slate-400">Se aplica a todas las filas pegadas; luego puedes cambiarlo en cada una.</p>
      </fieldset>
      <textarea v-model="textoLista" rows="5" class="del-campo mt-3 font-mono text-xs" placeholder="70123456, Ana, Pérez, ana@example.com, 987654321" aria-label="Lista de integrantes" />
      <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p class="text-xs text-slate-400">{{ vistaPrevia.filas.length }} fila(s) válida(s)</p>
        <button type="button" class="btn btn-outline" :disabled="pedirPlan && !planLista" @click="agregarLista">Agregar a la lista</button>
      </div>
      <ul v-if="vistaPrevia.errores.length" class="mt-2 list-disc pl-5 text-xs text-amber-200">
        <li v-for="error in vistaPrevia.errores" :key="error">{{ error }}</li>
      </ul>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { CodigoPlan, ErroresFormulario, FilaIntegrante, PlanVisible } from '~/types/delegaciones'
import { mensajeFallaConsultaDni } from '~/utils/consulta-dni'
import { ETIQUETA_PLAN, MAX_INTEGRANTES, filaEnBlanco, filaVacia, normalizarDni, prefijoDeCorreo } from '~/utils/delegaciones'
import { formatearSoles } from '~/utils/formato'
import { parsearListaIntegrantes } from '~/utils/lista-integrantes'
import { normalizeApiError } from '~/composables/useApi'

const filas = defineModel<FilaIntegrante[]>({ required: true })
const props = withDefaults(defineProps<{
  /** Errores por clave de fila (`erroresDeFila[clave].campo`). */
  errores?: Record<number, ErroresFormulario>
  /** Planes que admiten integrantes (los activos). Con uno solo no se pide elegir. El precio es opcional: si viene, se muestra. */
  planes: ReadonlyArray<Pick<PlanVisible, 'codigo'> & Partial<Pick<PlanVisible, 'precio'>>>
  /** Dominio de la delegación: el correo se escribe sin la `@` y se completa con él. */
  dominio?: string | null
}>(), { errores: () => ({}), dominio: null })

const { consultDni } = useConsultation()
const raiz = ref<HTMLElement | null>(null)

const planUnico = computed<CodigoPlan | ''>(() => (props.planes.length === 1 ? (props.planes[0]?.codigo ?? '') : ''))
const pedirPlan = computed(() => props.planes.length > 1)
const planLista = ref<CodigoPlan | ''>('')

// Las filas sin plan toman el único activo; si el elegido ya no sirve se limpia
watch(() => props.planes.map(plan => plan.codigo).join(','), () => {
  for (const fila of filas.value) {
    if (fila.plan && !props.planes.some(plan => plan.codigo === fila.plan)) fila.plan = planUnico.value
    else if (!fila.plan && planUnico.value) fila.plan = planUnico.value
  }
}, { immediate: true })

/** Enfoca un campo de una fila (el documento al agregarla, los nombres tras consultar el DNI). */
function enfocar(prefijo: 'doc' | 'nom', clave: number, desplazar = false) {
  const campo = raiz.value?.querySelector<HTMLElement>(`#int-${prefijo}-${clave}`)
  campo?.focus({ preventScroll: true })
  if (desplazar) campo?.scrollIntoView({ block: 'center', behavior: 'smooth' })
}

async function agregar() {
  if (filas.value.length >= MAX_INTEGRANTES) return
  const nueva = filaVacia(planUnico.value)
  filas.value = [...filas.value, nueva]
  await nextTick()
  enfocar('doc', nueva.clave, true)
}

function quitar(clave: number) {
  const resto = filas.value.filter(fila => fila.clave !== clave)
  filas.value = resto.length ? resto : [filaVacia(planUnico.value)]
}

/** Con dominio, si escriben el correo completo del dominio se deja solo el prefijo (el sufijo ya está a la vista). */
function alSalirDelCorreo(fila: FilaIntegrante) {
  if (props.dominio) fila.correo = prefijoDeCorreo(fila.correo, props.dominio)
}

/** Con 8 dígitos y sin nombres escritos, completa nombres y apellidos desde la consulta DNI. */
async function alEscribir(fila: FilaIntegrante) {
  fila.numeroDocumento = fila.numeroDocumento.replace(/\s+/g, '')
  if (fila.tipoDocumento !== 'dni' || !/^\d{8}$/.test(fila.numeroDocumento) || fila.buscando) return
  if (fila.nombres.trim() || fila.apellidos.trim()) return
  const numero = fila.numeroDocumento
  fila.buscando = true
  fila.aviso = ''
  try {
    const persona = await consultDni(numero)
    // Si cambió el número mientras consultaba, se descarta
    if (fila.numeroDocumento !== numero) return
    if (persona) Object.assign(fila, persona)
    else fila.aviso = 'La consulta no devolvió nombres. Escríbelos.'
  } catch (error) {
    if (fila.numeroDocumento === numero) fila.aviso = mensajeFallaConsultaDni(normalizeApiError(error), numero)
  } finally {
    fila.buscando = false
  }
}

/** Al salir del campo, un DNI de 7 dígitos (Excel perdió el cero) se completa y se consulta. */
function alSalir(fila: FilaIntegrante) {
  if (fila.tipoDocumento === 'dni') fila.numeroDocumento = normalizarDni(fila.numeroDocumento)
  void alEscribir(fila)
}

/** Enter en el documento no envía el formulario: consulta el DNI y pasa a los nombres. */
function alPulsarEnter(fila: FilaIntegrante) {
  alSalir(fila)
  enfocar('nom', fila.clave)
}

const textoLista = ref('')
const vistaPrevia = computed(() => parsearListaIntegrantes(textoLista.value))

function agregarLista() {
  const { filas: nuevas, errores } = vistaPrevia.value
  if (errores.length || !nuevas.length) return
  const plan = planUnico.value || planLista.value
  if (pedirPlan.value && !plan) return
  const conDatos = filas.value.filter(fila => fila.numeroDocumento || fila.nombres || fila.correo)
  filas.value = [...conDatos, ...nuevas.map(fila => ({ ...filaVacia(plan), ...fila, correo: prefijoDeCorreo(fila.correo, props.dominio), plan }))].slice(0, MAX_INTEGRANTES)
  textoLista.value = ''
}
</script>
