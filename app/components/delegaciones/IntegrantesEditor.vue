<template>
  <div class="space-y-4">
    <ul class="space-y-4">
      <li v-for="(fila, indice) in filas" :key="fila.clave" class="rounded-2xl border border-white/10 bg-white/[.04] p-4">
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-bold uppercase tracking-[.18em] text-primary-300">Integrante {{ indice + 1 }}</p>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
            :aria-label="`Quitar al integrante ${indice + 1}`"
            @click="quitar(fila.clave)"
          >
            <Icon name="heroicons:x-mark" class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <label :for="`int-doc-${fila.clave}`" class="del-label">Documento</label>
            <div class="flex gap-2">
              <select v-model="fila.tipoDocumento" class="del-campo w-24" aria-label="Tipo de documento">
                <option value="dni">DNI</option>
                <option value="ce">CE</option>
              </select>
              <input
                :id="`int-doc-${fila.clave}`"
                v-model="fila.numeroDocumento"
                class="del-campo min-w-0"
                maxlength="12"
                inputmode="numeric"
                autocomplete="off"
                :aria-invalid="Boolean(errores[fila.clave]?.numeroDocumento)"
                @input="alEscribir(fila)"
                @blur="alSalir(fila)"
              >
            </div>
            <p v-if="errores[fila.clave]?.numeroDocumento" class="del-error" role="alert">{{ errores[fila.clave]?.numeroDocumento }}</p>
            <p v-else-if="fila.buscando" class="mt-1 text-xs text-slate-400" role="status">Consultando el DNI…</p>
            <p v-else-if="fila.aviso" class="mt-1 text-xs text-amber-200" role="status">{{ fila.aviso }}</p>
          </div>
          <div>
            <label :for="`int-nom-${fila.clave}`" class="del-label">Nombres</label>
            <input :id="`int-nom-${fila.clave}`" v-model="fila.nombres" class="del-campo" maxlength="120" autocomplete="off" :aria-invalid="Boolean(errores[fila.clave]?.nombres)">
            <p v-if="errores[fila.clave]?.nombres" class="del-error" role="alert">{{ errores[fila.clave]?.nombres }}</p>
          </div>
          <div>
            <label :for="`int-ape-${fila.clave}`" class="del-label">Apellidos</label>
            <input :id="`int-ape-${fila.clave}`" v-model="fila.apellidos" class="del-campo" maxlength="120" autocomplete="off" :aria-invalid="Boolean(errores[fila.clave]?.apellidos)">
            <p v-if="errores[fila.clave]?.apellidos" class="del-error" role="alert">{{ errores[fila.clave]?.apellidos }}</p>
          </div>
          <div>
            <label :for="`int-cor-${fila.clave}`" class="del-label">Correo</label>
            <input :id="`int-cor-${fila.clave}`" v-model="fila.correo" type="email" class="del-campo" maxlength="191" autocomplete="off" :aria-invalid="Boolean(errores[fila.clave]?.correo)">
            <p v-if="errores[fila.clave]?.correo" class="del-error" role="alert">{{ errores[fila.clave]?.correo }}</p>
          </div>
          <div>
            <label :for="`int-cel-${fila.clave}`" class="del-label">Celular <span class="font-normal text-slate-400">(opcional)</span></label>
            <input :id="`int-cel-${fila.clave}`" v-model="fila.celular" class="del-campo" maxlength="15" inputmode="tel" autocomplete="off" :aria-invalid="Boolean(errores[fila.clave]?.celular)">
            <p v-if="errores[fila.clave]?.celular" class="del-error" role="alert">{{ errores[fila.clave]?.celular }}</p>
          </div>
        </div>
      </li>
    </ul>

    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class="btn btn-outline" :disabled="filas.length >= MAX_INTEGRANTES" @click="agregar">
        <Icon name="heroicons:user-plus" class="h-5 w-5" aria-hidden="true" /> Agregar integrante
      </button>
      <p class="text-sm text-slate-400">Con el DNI se completan los nombres automáticamente.</p>
    </div>

    <details class="rounded-2xl border border-white/10 bg-white/[.03] p-4">
      <summary class="cursor-pointer text-sm font-semibold text-slate-200">¿Tienes la lista en Excel? Pégala aquí</summary>
      <p class="mt-2 text-xs text-slate-400">
        Una persona por línea: <span class="font-mono">DNI, Nombres, Apellidos, Correo, Celular</span> (también acepta tabulador o punto y coma).
      </p>
      <textarea v-model="textoLista" rows="5" class="del-campo mt-2 font-mono text-xs" placeholder="70123456, Ana, Pérez, ana@example.com, 987654321" aria-label="Lista de integrantes" />
      <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p class="text-xs text-slate-400">{{ vistaPrevia.filas.length }} fila(s) válida(s)</p>
        <button type="button" class="btn btn-outline" @click="agregarLista">Agregar a la lista</button>
      </div>
      <ul v-if="vistaPrevia.errores.length" class="mt-2 list-disc pl-5 text-xs text-amber-200">
        <li v-for="error in vistaPrevia.errores" :key="error">{{ error }}</li>
      </ul>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { ErroresFormulario, FilaIntegrante } from '~/types/delegaciones'
import { mensajeFallaConsultaDni } from '~/utils/consulta-dni'
import { MAX_INTEGRANTES, filaVacia, normalizarDni } from '~/utils/delegaciones'
import { parsearListaIntegrantes } from '~/utils/lista-integrantes'
import { normalizeApiError } from '~/composables/useApi'

const filas = defineModel<FilaIntegrante[]>({ required: true })
withDefaults(defineProps<{
  /** Errores por clave de fila (`erroresDeFila[clave].campo`). */
  errores?: Record<number, ErroresFormulario>
}>(), { errores: () => ({}) })

const { consultDni } = useConsultation()

function agregar() {
  if (filas.value.length < MAX_INTEGRANTES) filas.value = [...filas.value, filaVacia()]
}

function quitar(clave: number) {
  const resto = filas.value.filter(fila => fila.clave !== clave)
  filas.value = resto.length ? resto : [filaVacia()]
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

const textoLista = ref('')
const vistaPrevia = computed(() => parsearListaIntegrantes(textoLista.value))

function agregarLista() {
  const { filas: nuevas, errores } = vistaPrevia.value
  if (errores.length || !nuevas.length) return
  const conDatos = filas.value.filter(fila => fila.numeroDocumento || fila.nombres || fila.correo)
  filas.value = [...conDatos, ...nuevas.map(fila => ({ ...filaVacia(), ...fila }))].slice(0, MAX_INTEGRANTES)
  textoLista.value = ''
}
</script>
