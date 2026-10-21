<template>
  <div class="space-y-5">
    <details v-if="billeteras.length || bancos.length" class="rounded-2xl border border-primary-400/25 bg-primary-400/[.06] p-4" open>
      <summary class="cursor-pointer text-sm font-semibold text-primary-200">¿Dónde pago?</summary>
      <div class="mt-3 grid gap-4 md:grid-cols-2">
        <div v-for="billetera in billeteras" :key="`b-${billetera.codigo}`" class="rounded-xl border border-white/10 bg-white/[.04] p-3">
          <p class="font-semibold text-white">{{ nombreBilletera(billetera) }}</p>
          <p class="text-sm text-slate-300">{{ billetera.telefono }}<span v-if="titularDe(billetera)"> · {{ titularDe(billetera) }}</span></p>
          <img v-if="urlQrBilletera(billetera)" :src="urlQrBilletera(billetera)" :alt="`QR de ${nombreBilletera(billetera)}`" class="mt-2 h-32 w-32 rounded-lg bg-white p-1" loading="lazy">
        </div>
        <div v-for="banco in bancos" :key="`c-${banco.codigo}`" class="rounded-xl border border-white/10 bg-white/[.04] p-3">
          <p class="font-semibold text-white">{{ banco.nombre }}</p>
          <p class="text-sm text-slate-300">Cuenta: <span class="font-mono">{{ banco.numeroCuenta }}</span></p>
          <p v-if="banco.cci" class="text-sm text-slate-300">CCI: <span class="font-mono">{{ banco.cci }}</span></p>
          <p v-if="datosPago?.titular" class="text-sm text-slate-400">{{ datosPago.titular }}</p>
        </div>
      </div>
    </details>

    <ul class="space-y-4">
      <li v-for="(pago, indice) in pagos" :key="pago.clave" class="rounded-2xl border border-white/10 bg-white/[.04] p-4">
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-bold uppercase tracking-[.18em] text-primary-300">Voucher {{ indice + 1 }}</p>
          <button
            v-if="pagos.length > 1"
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
            :aria-label="`Quitar el voucher ${indice + 1}`"
            @click="quitar(pago.clave)"
          >
            <Icon name="heroicons:x-mark" class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label :for="`pago-medio-${pago.clave}`" class="del-label">Pagué con</label>
            <select :id="`pago-medio-${pago.clave}`" v-model="pago.modalidadPago" class="del-campo" @change="completarMedio(pago)">
              <option v-if="billeteras.length || !bancos.length" value="billetera">Billetera digital</option>
              <option v-if="bancos.length" value="banco">Cuenta bancaria</option>
            </select>
          </div>
          <div v-if="pago.modalidadPago === 'billetera'">
            <label :for="`pago-bill-${pago.clave}`" class="del-label">Billetera</label>
            <select v-if="billeteras.length" :id="`pago-bill-${pago.clave}`" v-model="pago.billeteraDigital" class="del-campo" :aria-invalid="Boolean(errores[pago.clave]?.medio)">
              <option v-for="billetera in billeteras" :key="billetera.codigo" :value="billetera.codigo">{{ nombreBilletera(billetera) }}</option>
            </select>
            <input v-else :id="`pago-bill-${pago.clave}`" v-model="pago.billeteraDigital" class="del-campo" maxlength="40" placeholder="Yape, Plin…">
            <p v-if="errores[pago.clave]?.medio" class="del-error" role="alert">{{ errores[pago.clave]?.medio }}</p>
          </div>
          <template v-else>
            <div>
              <label :for="`pago-banco-${pago.clave}`" class="del-label">Banco</label>
              <select v-if="bancos.length" :id="`pago-banco-${pago.clave}`" v-model="pago.banco" class="del-campo" :aria-invalid="Boolean(errores[pago.clave]?.medio)">
                <option v-for="banco in bancos" :key="banco.codigo" :value="banco.codigo">{{ banco.nombre }}</option>
              </select>
              <input v-else :id="`pago-banco-${pago.clave}`" v-model="pago.banco" class="del-campo" maxlength="40">
              <p v-if="errores[pago.clave]?.medio" class="del-error" role="alert">{{ errores[pago.clave]?.medio }}</p>
            </div>
            <div>
              <label :for="`pago-tipo-${pago.clave}`" class="del-label">Tipo de operación</label>
              <select :id="`pago-tipo-${pago.clave}`" v-model="pago.tipoOperacion" class="del-campo">
                <option value="directo">Directo (mismo banco)</option>
                <option value="interbancario">Interbancario</option>
              </select>
            </div>
          </template>
          <div>
            <label :for="`pago-op-${pago.clave}`" class="del-label">N° de operación</label>
            <input :id="`pago-op-${pago.clave}`" v-model="pago.numeroOperacion" class="del-campo" maxlength="100" autocomplete="off" :aria-invalid="Boolean(errores[pago.clave]?.numeroOperacion)">
            <p v-if="errores[pago.clave]?.numeroOperacion" class="del-error" role="alert">{{ errores[pago.clave]?.numeroOperacion }}</p>
          </div>
          <div>
            <label :for="`pago-fecha-${pago.clave}`" class="del-label">Fecha de pago</label>
            <input :id="`pago-fecha-${pago.clave}`" v-model="pago.fechaPago" type="date" class="del-campo" :max="hoy" :aria-invalid="Boolean(errores[pago.clave]?.fechaPago)">
            <p v-if="errores[pago.clave]?.fechaPago" class="del-error" role="alert">{{ errores[pago.clave]?.fechaPago }}</p>
          </div>
          <div>
            <label :for="`pago-monto-${pago.clave}`" class="del-label">Monto del voucher (S/)</label>
            <input :id="`pago-monto-${pago.clave}`" v-model.number="pago.monto" type="number" min="0" step="0.01" inputmode="decimal" class="del-campo" :aria-invalid="Boolean(errores[pago.clave]?.monto)">
            <p v-if="errores[pago.clave]?.monto" class="del-error" role="alert">{{ errores[pago.clave]?.monto }}</p>
          </div>
          <div class="md:col-span-2">
            <label :for="`pago-archivo-${pago.clave}`" class="del-label">Archivo del voucher <span class="font-normal text-slate-400">(PDF, JPG, PNG o WebP, máx. 5 MB)</span></label>
            <input :id="`pago-archivo-${pago.clave}`" type="file" :accept="VOUCHER_ACCEPT" class="del-campo" :aria-invalid="Boolean(errores[pago.clave]?.archivo)" @change="alElegirArchivo(pago, $event)">
            <p v-if="pago.archivo" class="mt-1 text-xs text-slate-400">{{ pago.archivo.name }}</p>
            <p v-if="errores[pago.clave]?.archivo" class="del-error" role="alert">{{ errores[pago.clave]?.archivo }}</p>
          </div>
        </div>
      </li>
    </ul>

    <div class="flex flex-wrap items-center gap-3">
      <button v-if="pagos.length < MAX_VOUCHERS_POR_ENVIO" type="button" class="btn btn-outline" @click="agregar">
        <Icon name="heroicons:plus" class="h-5 w-5" aria-hidden="true" /> Agregar otro voucher
      </button>
      <p v-else class="text-sm text-slate-400">Máximo {{ MAX_VOUCHERS_POR_ENVIO }} vouchers por envío; puedes volver con tu link para subir más.</p>
      <p class="text-sm text-slate-400">¿Pagaste en varias partes? Sube un voucher por cada pago.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BilleteraDigital, CuentaBancaria, DatosPago } from '~/types/evento'
import type { ErroresFormulario, PagoFormulario } from '~/types/delegaciones'
import { MAX_VOUCHERS_POR_ENVIO, pagoVacio } from '~/utils/delegaciones'
import { nombreBilletera, titularBilletera, urlQrBilletera } from '~/utils/formato'
import { VOUCHER_ACCEPT, fechaHoyLima } from '~/utils/inscripcion'

const pagos = defineModel<PagoFormulario[]>({ required: true })
const props = withDefaults(defineProps<{
  datosPago?: DatosPago | null
  /** Errores por clave de voucher. */
  errores?: Record<number, ErroresFormulario>
}>(), { datosPago: null, errores: () => ({}) })

const hoy = fechaHoyLima()
const bancos = computed<CuentaBancaria[]>(() => props.datosPago?.bancos ?? [])
const billeteras = computed<BilleteraDigital[]>(() => props.datosPago?.billeteras ?? [])
const titularDe = (billetera: BilleteraDigital) => titularBilletera(billetera, props.datosPago?.titular ?? '')

/** Deja elegido el primer medio disponible de la modalidad (para que el voucher nunca quede sin medio). */
function completarMedio(pago: PagoFormulario) {
  if (pago.modalidadPago === 'billetera' && !pago.billeteraDigital) pago.billeteraDigital = billeteras.value[0]?.codigo ?? ''
  if (pago.modalidadPago === 'banco' && !pago.banco) pago.banco = bancos.value[0]?.codigo ?? ''
}

function nuevo(): PagoFormulario {
  const pago = pagoVacio()
  // Billetera si el evento tiene (la opción por defecto); si solo hay cuentas, banco
  pago.modalidadPago = billeteras.value.length || !bancos.value.length ? 'billetera' : 'banco'
  completarMedio(pago)
  return pago
}

function agregar() {
  if (pagos.value.length < MAX_VOUCHERS_POR_ENVIO) pagos.value = [...pagos.value, nuevo()]
}

function quitar(clave: number) {
  const resto = pagos.value.filter(pago => pago.clave !== clave)
  pagos.value = resto.length ? resto : [nuevo()]
}

function alElegirArchivo(pago: PagoFormulario, evento: Event) {
  pago.archivo = (evento.target as HTMLInputElement).files?.[0] ?? null
}

// Los vouchers que ya existen al abrir toman el primer medio disponible
onMounted(() => { for (const pago of pagos.value) completarMedio(pago) })
watch(() => props.datosPago, () => { for (const pago of pagos.value) completarMedio(pago) })

defineExpose({ nuevo })
</script>
