<!-- Formulario público de registro de una delegación: el representante llena sus datos, agrega a
     todo su grupo y paga el total con un solo voucher. El monto definitivo lo calcula el backend
     (contrato: backend-ciisic/specs/018-delegaciones/contracts/api-delegaciones.md). -->
<template>
  <div>
    <section v-if="registro" class="support-card rounded-2xl p-6 sm:p-8" aria-live="polite">
      <span class="icon-tile inline-flex h-14 w-14 items-center justify-center rounded-2xl"><Icon name="heroicons:check-circle" class="h-7 w-7" /></span>
      <h2 class="mt-4 text-2xl font-bold text-white">Registro enviado</h2>
      <p class="mt-2 leading-relaxed text-slate-300">Registramos a tu delegación con {{ registro.registrados }} integrantes. Sus inscripciones quedan pendientes de la revisión del pago.</p>
      <dl class="mt-6 grid gap-4 sm:grid-cols-3">
        <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Delegación</dt><dd class="mt-1 text-white">{{ registro.nombre }}</dd></div>
        <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Integrantes</dt><dd class="mt-1 text-white">{{ registro.registrados }}</dd></div>
        <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Monto total según el sistema</dt><dd class="mt-1 text-white">{{ formatearSoles(registro.montoTotal) }}</dd></div>
      </dl>
      <div class="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Link de tu delegación</p>
        <p class="mt-1 text-sm text-slate-300">Guárdalo para consultar el estado del grupo:</p>
        <p class="mt-2 break-all font-mono text-sm text-white">{{ enlaceSeguimiento }}</p>
      </div>
      <div class="mt-6 flex flex-wrap gap-4">
        <a href="https://wa.me/51955204231" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-primary-400/50 px-5 py-3 font-semibold text-primary-300 transition hover:bg-primary-400/10"><Icon name="heroicons:chat-bubble-left-right" class="h-5 w-5" />Contactar al equipo</a>
        <NuxtLink to="/" class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-slate-300 transition hover:text-white"><Icon name="heroicons:arrow-left" class="h-5 w-5" />Volver al inicio</NuxtLink>
      </div>
    </section>

    <form v-else class="flex flex-col gap-8" novalidate @submit.prevent="enviar">
      <!-- El link que comparten: el registro se suma a esa delegación -->
      <section v-if="delegacion" class="support-card rounded-2xl p-6 sm:p-8" aria-live="polite">
        <p class="text-xs font-bold uppercase tracking-wider text-primary-300">Delegación</p>
        <h2 class="mt-1 text-2xl font-bold text-white">{{ delegacion.nombre }}</h2>
        <p v-if="delegacion.institucion" class="mt-1 text-slate-300">{{ delegacion.institucion }}</p>
        <p class="mt-3 leading-relaxed text-slate-300">
          Registra a los integrantes de tu grupo y paga el total. Tu registro se sumará a esta delegación.
        </p>
      </section>

      <!-- 1. Representante -->
      <section class="support-card rounded-2xl p-6 sm:p-8">
        <h2 class="text-xl font-bold text-white">1. Representante de la delegación</h2>
        <p class="mt-1 leading-relaxed text-slate-300">Tus datos: eres quien se encarga del grupo y de su pago.</p>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label for="representante-nombres" class="block text-sm text-slate-300">Nombres *</label>
            <input id="representante-nombres" v-model="representante.nombres" type="text" autocomplete="given-name" class="campo" @input="tocarRepresentante">
            <p v-if="erroresVisibles && errorRepresentante('nombres')" class="mensaje-error">{{ errorRepresentante('nombres') }}</p>
          </div>
          <div>
            <label for="representante-apellidos" class="block text-sm text-slate-300">Apellidos *</label>
            <input id="representante-apellidos" v-model="representante.apellidos" type="text" autocomplete="family-name" class="campo" @input="tocarRepresentante">
            <p v-if="erroresVisibles && errorRepresentante('apellidos')" class="mensaje-error">{{ errorRepresentante('apellidos') }}</p>
          </div>
          <div>
            <label for="representante-tipo-documento" class="block text-sm text-slate-300">Tipo de documento *</label>
            <select id="representante-tipo-documento" v-model="representante.tipoDocumento" class="campo" @change="tocarRepresentante">
              <option value="dni">DNI</option>
              <option value="ce">Carné de extranjería</option>
            </select>
          </div>
          <div>
            <label for="representante-documento" class="block text-sm text-slate-300">Número de documento *</label>
            <input id="representante-documento" v-model="representante.numeroDocumento" type="text" autocomplete="off" class="campo" @input="tocarRepresentante">
            <p v-if="erroresVisibles && errorRepresentante('numeroDocumento')" class="mensaje-error">{{ errorRepresentante('numeroDocumento') }}</p>
          </div>
          <div>
            <label for="representante-correo" class="block text-sm text-slate-300">Correo electrónico *</label>
            <input id="representante-correo" v-model="representante.correo" type="email" autocomplete="email" class="campo" @input="tocarRepresentante">
            <p v-if="erroresVisibles && errorRepresentante('correo')" class="mensaje-error">{{ errorRepresentante('correo') }}</p>
          </div>
          <div>
            <label for="representante-celular" class="block text-sm text-slate-300">Celular *</label>
            <input id="representante-celular" v-model="representante.celular" type="tel" autocomplete="tel" class="campo" @input="tocarRepresentante">
            <p v-if="erroresVisibles && errorRepresentante('celular')" class="mensaje-error">{{ errorRepresentante('celular') }}</p>
          </div>
        </div>
        <label class="mt-4 flex cursor-pointer items-start gap-3 text-slate-300">
          <input v-model="representante.esIntegrante" type="checkbox" class="mt-1 h-5 w-5 rounded border-white/20 bg-white/5 text-primary-400 focus:ring-primary-400">
          <span>También integro la delegación. Si lo marcas, tú cuentas como el integrante 1 y puedes editar tus datos en esta sección.</span>
        </label>
      </section>

      <!-- 2. Datos de la delegación -->
      <section class="support-card rounded-2xl p-6 sm:p-8">
        <h2 class="text-xl font-bold text-white">2. Datos de la delegación</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label for="delegacion-nombre" class="block text-sm text-slate-300">Nombre de la delegación *</label>
            <input id="delegacion-nombre" v-model="datos.nombre" type="text" autocomplete="organization" class="campo">
            <p v-if="erroresVisibles && errorCampoDelegacion('nombre')" class="mensaje-error">{{ errorCampoDelegacion('nombre') }}</p>
          </div>
          <div>
            <label for="delegacion-institucion" class="block text-sm text-slate-300">Institución</label>
            <input id="delegacion-institucion" v-model="datos.institucion" type="text" autocomplete="organization" class="campo">
            <p v-if="erroresVisibles && errorCampoDelegacion('institucion')" class="mensaje-error">{{ errorCampoDelegacion('institucion') }}</p>
          </div>
        </div>
      </section>

      <!-- 3. Integrantes -->
      <section class="support-card rounded-2xl p-6 sm:p-8">
        <h2 class="text-xl font-bold text-white">3. Integrantes de la delegación</h2>
        <p class="mt-1 leading-relaxed text-slate-300">
          Agrega a todas las personas que integran tu grupo (hasta {{ MAXIMO_PARTICIPANTES_DELEGACION }} por registro).
        </p>
        <p v-if="avisoCantidad" class="mt-2 rounded-xl border border-primary-400/30 bg-primary-400/5 p-3 text-sm text-slate-300" aria-live="polite">{{ avisoCantidad }}</p>

        <!-- Carga masiva -->
        <details class="mt-4 rounded-xl border border-white/10 p-4">
          <summary class="cursor-pointer text-sm font-semibold text-white">Pegar la lista de integrantes</summary>
          <p class="mt-2 text-sm text-slate-300">Una persona por línea, con el formato <code class="font-mono text-xs">DNI, Nombres, Apellidos, Correo</code> (el celular es opcional). También puedes pegar el nombre completo en una sola columna.</p>
          <textarea v-model="textoCarga" rows="5" class="campo mt-3" placeholder="12345678, Ana, Pérez, ana@undc.edu.pe" />
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" class="boton-secundario" @click="cargarLista">
              <Icon name="heroicons:clipboard-document" class="h-5 w-5" />Agregar a la lista
            </button>
            <p v-if="erroresCarga.length" class="text-sm text-rose-200">{{ erroresCarga.join(' ') }}</p>
            <p v-else-if="avisoCarga" class="text-sm text-slate-300">{{ avisoCarga }}</p>
          </div>
        </details>

        <!-- El representante, si integra el grupo, es el integrante 1 (sus datos se editan arriba) -->
        <div v-if="representante.esIntegrante" class="mt-6 rounded-2xl border border-primary-400/30 bg-primary-400/5 p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm font-bold text-white">Integrante 1 — tú (representante)</p>
            <span class="text-xs text-slate-400">Se edita en la sección 1</span>
          </div>
          <p class="mt-2 text-sm text-slate-300">
            {{ representante.nombres }} {{ representante.apellidos }} ·
            {{ representante.tipoDocumento === 'dni' ? 'DNI' : 'CE' }} {{ representante.numeroDocumento }} ·
            {{ representante.correo }}
          </p>
        </div>

        <div v-for="(fila, indice) in filas" :key="indice" class="mt-6 rounded-2xl border border-white/10 p-4">
          <div class="flex items-center justify-between">
            <p class="text-sm font-bold text-white">Integrante {{ indice + (representante.esIntegrante ? 2 : 1) }}</p>
            <button v-if="filas.length > 1" type="button" class="inline-flex items-center gap-1 text-sm font-semibold text-slate-300 transition hover:text-white" @click="quitarFila(indice)">
              <Icon name="heroicons:trash" class="h-4 w-4" />Quitar
            </button>
          </div>
          <div class="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label :for="`tipo-documento-${indice}`" class="block text-sm text-slate-300">Tipo de documento</label>
              <select :id="`tipo-documento-${indice}`" v-model="fila.tipoDocumento" class="campo" @change="tocar(indice)">
                <option value="dni">DNI</option>
                <option value="ce">Carné de extranjería</option>
              </select>
            </div>
            <div>
              <label :for="`numero-documento-${indice}`" class="block text-sm text-slate-300">Número de documento</label>
              <input :id="`numero-documento-${indice}`" v-model="fila.numeroDocumento" type="text" autocomplete="off" class="campo" @input="tocar(indice)">
              <p v-if="tocadas[indice] && errores[indice]?.numeroDocumento" class="mensaje-error">{{ errores[indice]?.numeroDocumento }}</p>
            </div>
            <div>
              <label :for="`nombres-${indice}`" class="block text-sm text-slate-300">Nombres</label>
              <input :id="`nombres-${indice}`" v-model="fila.nombres" type="text" autocomplete="off" class="campo" @input="tocar(indice)">
              <p v-if="tocadas[indice] && errores[indice]?.nombres" class="mensaje-error">{{ errores[indice]?.nombres }}</p>
            </div>
            <div>
              <label :for="`apellidos-${indice}`" class="block text-sm text-slate-300">Apellidos</label>
              <input :id="`apellidos-${indice}`" v-model="fila.apellidos" type="text" autocomplete="off" class="campo" @input="tocar(indice)">
              <p v-if="tocadas[indice] && errores[indice]?.apellidos" class="mensaje-error">{{ errores[indice]?.apellidos }}</p>
            </div>
            <div>
              <label :for="`correo-${indice}`" class="block text-sm text-slate-300">Correo electrónico</label>
              <input :id="`correo-${indice}`" v-model="fila.correo" type="email" autocomplete="off" class="campo" @input="tocar(indice)">
              <p v-if="tocadas[indice] && errores[indice]?.correo" class="mensaje-error">{{ errores[indice]?.correo }}</p>
            </div>
            <div>
              <label :for="`celular-${indice}`" class="block text-sm text-slate-300">Celular (opcional)</label>
              <input :id="`celular-${indice}`" v-model="fila.celular" type="tel" autocomplete="off" class="campo" @input="tocar(indice)">
              <p v-if="tocadas[indice] && errores[indice]?.celular" class="mensaje-error">{{ errores[indice]?.celular }}</p>
            </div>
          </div>
        </div>

        <button type="button" class="boton-secundario mt-4" :disabled="filas.length >= MAXIMO_PARTICIPANTES_DELEGACION" @click="agregarFila">
          <Icon name="heroicons:plus" class="h-5 w-5" />Agregar integrante
        </button>
      </section>

      <!-- 4. Pago -->
      <section class="support-card rounded-2xl p-6 sm:p-8">
        <h2 class="text-xl font-bold text-white">4. Pago del total</h2>
        <p class="mt-1 leading-relaxed text-slate-300">Un solo pago cubre a todos los integrantes. El monto exacto lo confirma el sistema al registrar.</p>

        <div v-if="!hayMediosDePago" class="mt-4 rounded-xl border border-white/10 p-4 text-sm text-slate-300">
          Los datos de pago aún no están disponibles; comunícate con la organización.
        </div>

        <template v-else>
          <div class="mt-4">
            <span class="block text-sm font-semibold text-white">Modalidad de depósito</span>
            <div class="mt-2 flex flex-wrap gap-4" role="radiogroup" aria-label="Modalidad de depósito">
              <label v-for="opcion in modalidadesPago" :key="opcion.valor" class="inline-flex cursor-pointer items-center gap-2 text-slate-300">
                <input :id="`modalidad-${opcion.valor}`" type="radio" name="modalidadPago" :value="opcion.valor" class="sr-only" :checked="medio.modalidad === opcion.valor" @change="eleccion.modalidad = opcion.valor">
                <span class="radio-custom-indicator" :class="{ 'selected': medio.modalidad === opcion.valor }"><span v-if="medio.modalidad === opcion.valor" class="radio-dot" /></span>
                <span>{{ opcion.etiqueta }}</span>
              </label>
            </div>
          </div>

          <div v-if="medio.billetera" class="mt-4 rounded-xl border border-slate-700 bg-slate-900/45 p-4">
            <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Datos de {{ nombreBilletera(medio.billetera) }}</p>
            <div class="mt-2 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p class="font-mono text-lg font-bold text-white">{{ medio.billetera.telefono }}</p>
                <p v-if="titularBilletera(medio.billetera, datosPagoEvento?.titular || '')" class="mt-1 text-xs text-slate-400">Titular: {{ titularBilletera(medio.billetera, datosPagoEvento?.titular || '') }}</p>
              </div>
              <img v-if="urlQrBilletera(medio.billetera)" :src="urlQrBilletera(medio.billetera)" :alt="`Código QR de ${nombreBilletera(medio.billetera)}`" class="h-32 w-32 rounded-lg bg-white object-contain p-1.5">
            </div>
            <div v-if="billeteras.length > 1" class="mt-4">
              <label for="billetera-digital" class="block text-sm text-slate-300">Billetera digital</label>
              <select id="billetera-digital" v-model="eleccion.billetera" class="campo">
                <option v-for="billetera in billeteras" :key="billetera.codigo" :value="billetera.codigo">{{ nombreBilletera(billetera) }}</option>
              </select>
            </div>
          </div>

          <div v-else-if="medio.banco" class="mt-4 rounded-xl border border-slate-700 bg-slate-900/45 p-4">
            <div v-if="bancos.length > 1">
              <label for="banco-deposito" class="block text-sm text-slate-300">Banco</label>
              <select id="banco-deposito" v-model="eleccion.banco" class="campo">
                <option v-for="banco in bancos" :key="banco.codigo" :value="banco.codigo">{{ banco.nombre }}</option>
              </select>
            </div>
            <div class="mt-3 flex flex-wrap gap-4" role="radiogroup" aria-label="Tipo de operación">
              <label v-for="opcion in TIPOS_OPERACION" :key="opcion.valor" class="inline-flex cursor-pointer items-center gap-2 text-slate-300">
                <input :id="`tipo-operacion-${opcion.valor}`" type="radio" name="tipoOperacion" :value="opcion.valor" class="sr-only" :checked="tipoOperacion === opcion.valor" @change="tipoOperacion = opcion.valor">
                <span class="radio-custom-indicator" :class="{ 'selected': tipoOperacion === opcion.valor }"><span v-if="tipoOperacion === opcion.valor" class="radio-dot" /></span>
                <span>{{ opcion.etiqueta }}</span>
              </label>
            </div>
            <div class="mt-3">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{ tipoOperacion === 'interbancario' ? `CCI ${medio.banco.nombre}` : `Cuenta ${medio.banco.nombre}` }}</p>
              <p class="mt-1 font-mono text-lg font-bold text-white">{{ tipoOperacion === 'interbancario' ? medio.banco.cci : medio.banco.numeroCuenta }}</p>
              <p v-if="datosPagoEvento?.titular" class="mt-1 text-xs text-slate-400">Titular: {{ datosPagoEvento.titular }}</p>
            </div>
          </div>

          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label for="numero-operacion" class="block text-sm text-slate-300">Código del voucher *</label>
              <input id="numero-operacion" v-model="codigoVoucher" type="text" autocomplete="off" class="campo">
              <p v-if="erroresVisibles && !codigoVoucherValido" class="mensaje-error">Escribe el código del voucher (entre 3 y 100 caracteres).</p>
            </div>
            <div>
              <label for="fecha-pago" class="block text-sm text-slate-300">Fecha de pago *</label>
              <input id="fecha-pago" v-model="fechaPago" type="date" :max="hoy" class="campo">
              <p v-if="erroresVisibles && !fechaPagoValida" class="mensaje-error">Ingresa una fecha válida que no sea futura.</p>
            </div>
            <div class="sm:col-span-2">
              <label for="voucher" class="block text-sm text-slate-300">Voucher de pago (PDF, JPG, PNG o WebP, hasta 5 MB) *</label>
              <input id="voucher" type="file" class="campo" :accept="VOUCHER_ACCEPT" @change="seleccionarVoucher">
              <p v-if="archivoVoucher" class="mt-1 text-sm text-slate-300">Archivo: {{ archivoVoucher.name }}</p>
              <p v-if="erroresVisibles && errorVoucher" class="mensaje-error">{{ errorVoucher }}</p>
            </div>
          </div>
        </template>
      </section>

      <!-- 5. Resumen y envío -->
      <section class="support-card rounded-2xl p-6 sm:p-8">
        <h2 class="text-xl font-bold text-white">Resumen</h2>
        <dl class="mt-4 grid gap-4 sm:grid-cols-3">
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Integrantes</dt><dd class="mt-1 text-white">{{ totalIntegrantes }}</dd></div>
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Precio por persona</dt><dd class="mt-1 text-white">{{ formatearSoles(precioUnitarioVigente) }}</dd></div>
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Estimado total</dt><dd class="mt-1 text-white">{{ formatearSoles(estimado) }}</dd></div>
        </dl>
        <p class="mt-2 text-sm text-slate-300">Estimado: {{ formatearSoles(precioUnitarioVigente) }} × {{ totalIntegrantes }} integrantes. El monto definitivo lo calcula y confirma el sistema al registrar.</p>

        <p v-if="mensajeError" class="mt-4 rounded-xl border border-rose-400/40 bg-rose-400/10 p-3 text-sm text-rose-200" role="alert">{{ mensajeError }}</p>

        <button type="submit" class="boton-primario mt-6" :disabled="enviando">
          <Icon name="heroicons:check-circle" class="h-5 w-5" />
          {{ enviando ? 'Registrando…' : 'Registrar delegación' }}
        </button>
      </section>
    </form>
  </div>
</template>

<script setup lang="ts">
import type {
  DatosDelegacion,
  FilaParticipante,
  RegistroDelegacionCreado,
  RepresentanteDelegacion,
} from '~/types/delegaciones'
import {
  MAXIMO_PARTICIPANTES_DELEGACION,
  aRegistroDelegacion,
  erroresDatosDelegacion,
  erroresParticipante,
  erroresRepresentante,
  estimadoTotal,
  parsearParticipantesDelegacion,
  precioUnitarioDelegacion,
  validarDatosDelegacion,
  validarFilasParticipantes,
  validarPagoDelegacion,
  validarRepresentante,
} from '~/utils/delegaciones'
import { VOUCHER_ACCEPT, fechaHoyLima, validarArchivoVoucher } from '~/utils/inscripcion'
import { formatearSoles, nombreBilletera, titularBilletera, urlQrBilletera } from '~/utils/formato'
import { modalidadesDisponibles, resolverMedioPago, type EleccionPago } from '~/utils/medios-pago'
import { mensajeErrorDelegacion } from '~/utils/errores-api'
import { normalizeApiError, useApi } from '~/composables/useApi'
import { rutasSitio } from '~/utils/rutas-sitio'

const props = defineProps<{ codigoLink?: string }>()

const { evento } = useEvento()
const { tarifa } = useTarifaDelegaciones()
const { delegacion } = useDelegacionPorLink(() => props.codigoLink)

const datos = ref<DatosDelegacion>({ nombre: '', institucion: '' })
const representante = ref<RepresentanteDelegacion>({
  nombres: '',
  apellidos: '',
  tipoDocumento: 'dni',
  numeroDocumento: '',
  correo: '',
  celular: '',
  esIntegrante: true,
})
const filas = ref<FilaParticipante[]>([filaVacia()])
const tocadas = ref<boolean[]>([false])
const erroresVisibles = ref(false)
const representanteTocado = ref(false)
const textoCarga = ref('')
const erroresCarga = ref<string[]>([])
const avisoCarga = ref('')

const eleccion = ref<EleccionPago>({ modalidad: null, banco: null, billetera: null })
const tipoOperacion = ref<'directo' | 'interbancario'>('directo')
const codigoVoucher = ref('')
const hoy = fechaHoyLima()
const fechaPago = ref(hoy)
const archivoVoucher = ref<File | null>(null)

const enviando = ref(false)
const mensajeError = ref('')
const registro = ref<RegistroDelegacionCreado | null>(null)

const TIPOS_OPERACION = [
  { valor: 'directo' as const, etiqueta: 'Depósito/transferencia directa' },
  { valor: 'interbancario' as const, etiqueta: 'Transferencia interbancaria' },
]

function filaVacia(): FilaParticipante {
  return { tipoDocumento: 'dni', numeroDocumento: '', nombres: '', apellidos: '', correo: '', celular: '' }
}

const bancos = computed(() => evento.value?.datosPago?.bancos ?? [])
const billeteras = computed(() => evento.value?.datosPago?.billeteras ?? [])
const modalidadesPago = computed(() => modalidadesDisponibles(bancos.value, billeteras.value))
const hayMediosDePago = computed(() => modalidadesPago.value.length > 0)
const medio = computed(() => resolverMedioPago(bancos.value, billeteras.value, eleccion.value))

/** Datos de pago del evento (bancos, billeteras y titular). */
const datosPagoEvento = computed(() => evento.value?.datosPago ?? null)

/** La delegación del link (si lo hay) manda sobre la tarifa por defecto del evento. */
const tarifaVigente = computed(() => {
  if (delegacion.value) {
    return {
      minIntegrantes: delegacion.value.minIntegrantes,
      precioEstandar: delegacion.value.precioEstandar,
      precioPromocional: delegacion.value.precioPromocional,
    }
  }
  return tarifa.value
})

/** El representante cuenta como integrante si lo marcó. */
const totalIntegrantes = computed(() => filas.value.length + (representante.value.esIntegrante ? 1 : 0))
const precioUnitarioVigente = computed(() => {
  const t = tarifaVigente.value
  if (!t) return 0
  return precioUnitarioDelegacion(t.precioEstandar, t.precioPromocional, t.minIntegrantes, totalIntegrantes.value)
})
const estimado = computed(() => {
  const t = tarifaVigente.value
  return t ? estimadoTotal(t, totalIntegrantes.value) : 0
})

const errores = computed(() => filas.value.map(fila => erroresParticipante(fila)))
const erroresDelegacion = computed(() => erroresDatosDelegacion(datos.value))
const erroresDelRepresentante = computed(() => erroresRepresentante(representante.value))

const avisoCantidad = computed(() => {
  const t = tarifaVigente.value
  if (!t || totalIntegrantes.value >= t.minIntegrantes) return ''
  return `A partir de ${t.minIntegrantes} integrantes se aplica el precio promocional de ${formatearSoles(t.precioPromocional)} por persona.`
})

const codigoVoucherValido = computed(() => {
  const largo = codigoVoucher.value.trim().length
  return largo >= 3 && largo <= 100
})
const fechaPagoValida = computed(() => /^\d{4}-\d{2}-\d{2}$/.test(fechaPago.value) && fechaPago.value <= hoy)
const errorVoucher = computed(() => validarArchivoVoucher(archivoVoucher.value))

/** Link para consultar el grupo más adelante. */
const enlaceSeguimiento = computed(() => {
  if (!registro.value) return ''
  const base = import.meta.client ? window.location.origin : ''
  return `${base}/delegaciones?delegacion=${registro.value.codigoLink}`
})

function errorCampoDelegacion(campo: keyof DatosDelegacion): string {
  return erroresDelegacion.value[campo] ?? ''
}

function errorRepresentante(campo: keyof ReturnType<typeof erroresRepresentante>): string {
  return erroresDelRepresentante.value[campo] ?? ''
}

function tocar(indice: number) {
  tocadas.value[indice] = true
}

function tocarRepresentante() {
  representanteTocado.value = true
}

function agregarFila() {
  if (filas.value.length >= MAXIMO_PARTICIPANTES_DELEGACION) return
  filas.value.push(filaVacia())
  tocadas.value.push(false)
}

function quitarFila(indice: number) {
  filas.value.splice(indice, 1)
  tocadas.value.splice(indice, 1)
}

/** Pega la lista de integrantes: los que ya están no se duplican. */
function cargarLista() {
  erroresCarga.value = []
  avisoCarga.value = ''
  const { filas: nuevas, errores } = parsearParticipantesDelegacion(textoCarga.value)
  if (errores.length) {
    erroresCarga.value = errores
    return
  }
  const existentes = new Set(filas.value.map(fila => `${fila.tipoDocumento}:${fila.numeroDocumento}`))
  let agregadas = 0
  for (const fila of nuevas) {
    if (existentes.has(`${fila.tipoDocumento}:${fila.numeroDocumento}`)) continue
    if (filas.value.length >= MAXIMO_PARTICIPANTES_DELEGACION) break
    filas.value.push(fila)
    tocadas.value.push(false)
    existentes.add(`${fila.tipoDocumento}:${fila.numeroDocumento}`)
    agregadas++
  }
  textoCarga.value = ''
  avisoCarga.value = agregadas
    ? `Agregamos ${agregadas} integrantes a la lista.`
    : 'Todos los integrantes de la lista ya estaban agregados.'
}

function seleccionarVoucher(evento: Event) {
  const input = evento.target as HTMLInputElement
  const archivo = input.files?.[0] ?? null
  const problema = archivo ? validarArchivoVoucher(archivo) : ''
  if (problema) {
    mensajeError.value = `Voucher: ${problema}`
    input.value = ''
    archivoVoucher.value = null
    return
  }
  archivoVoucher.value = archivo
}

async function enviar() {
  mensajeError.value = ''
  erroresVisibles.value = true
  tocadas.value = tocadas.value.map(() => true)
  representanteTocado.value = true

  const errorRepresentanteDatos = validarRepresentante(representante.value)
  const errorDelegacion = validarDatosDelegacion(datos.value)
  const errorLista = validarFilasParticipantes(filas.value)
  const errorPago = validarPagoDelegacion({
    modalidadPago: medio.value.modalidad ?? 'banco',
    banco: medio.value.banco?.codigo ?? null,
    tipoOperacion: tipoOperacion.value,
    billeteraDigital: medio.value.billetera?.codigo ?? null,
    numeroOperacion: codigoVoucher.value,
    fechaPago: fechaPago.value,
    voucher: archivoVoucher.value,
  })
  const error = errorRepresentanteDatos ?? errorDelegacion ?? errorLista ?? errorPago
  if (error) {
    mensajeError.value = error
    return
  }

  enviando.value = true
  try {
    const cuerpo = aRegistroDelegacion({
      codigoLink: props.codigoLink ?? null,
      delegacion: datos.value,
      representante: representante.value,
      participantes: filas.value,
      pago: {
        modalidadPago: medio.value.modalidad!,
        banco: medio.value.banco?.codigo ?? null,
        tipoOperacion: medio.value.modalidad === 'banco' ? tipoOperacion.value : null,
        billeteraDigital: medio.value.billetera?.codigo ?? null,
        numeroOperacion: codigoVoucher.value,
        fechaPago: fechaPago.value,
        voucher: archivoVoucher.value!,
      },
    })
    const respuesta = await useApi().request<{ success: true, data: RegistroDelegacionCreado }>(rutasSitio.delegaciones, { method: 'POST', body: cuerpo, timeout: 60000 })
    registro.value = respuesta.data
  } catch (error) {
    mensajeError.value = mensajeErrorDelegacion(normalizeApiError(error))
  } finally {
    enviando.value = false
  }
}

// La delegación del link precarga sus datos; sin link, el formulario va en blanco.
watch(delegacion, (valor) => {
  if (!valor) return
  datos.value.nombre = valor.nombre
  datos.value.institucion = valor.institucion ?? ''
  if (valor.representanteNombre) {
    const partes = valor.representanteNombre.trim().split(/\s+/)
    representante.value.nombres = partes.slice(0, -1).join(' ')
    representante.value.apellidos = partes.at(-1) ?? ''
  }
}, { immediate: true })
</script>

<style scoped>
.support-card { background: #082c52; border: 1px solid #ffffff1c; }
.icon-tile { background: #00d9e81a; color: #67e8f9; }
.campo { margin-top: 0.25rem; width: 100%; border-radius: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.05); padding: 0.75rem 1rem; color: #fff; }
.campo:focus { outline: none; border-color: #00d9e8; }
.mensaje-error { margin-top: 0.25rem; font-size: 0.875rem; color: #fca5a5; }
.boton-primario { display: inline-flex; min-height: 3rem; align-items: center; justify-content: center; gap: 0.5rem; border-radius: 0.75rem; padding: 0.75rem 1.5rem; background: #00d9e8; color: #041d39; font-weight: 700; transition: background-color 0.2s; }
.boton-primario:hover:not(:disabled) { background: #67e8f9; }
.boton-primario:disabled { opacity: 0.6; cursor: not-allowed; }
.boton-secundario { display: inline-flex; min-height: 3rem; align-items: center; justify-content: center; gap: 0.5rem; border: 1px solid rgba(34, 211, 238, 0.5); border-radius: 0.75rem; padding: 0.75rem 1.25rem; color: #67e8f9; font-weight: 600; transition: background-color 0.2s; }
.boton-secundario:hover:not(:disabled) { background: rgba(34, 211, 238, 0.1); }
.boton-secundario:disabled { opacity: 0.5; cursor: not-allowed; }

.radio-custom-indicator { width: 1.25rem; height: 1.25rem; border: 2px solid #475569; border-radius: 9999px; display: flex; align-items: center; justify-content: center; transition: all 300ms; }
.radio-custom-indicator.selected { background-color: #00d9e8; border-color: #00d9e8; }
.radio-dot { width: 0.5rem; height: 0.5rem; border-radius: 9999px; background-color: #041d39; }
</style>
