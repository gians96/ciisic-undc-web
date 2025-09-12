<template>
  <div>
    <!-- ===========================================================================
        ENCABEZADO DE PÁGINA
        ============================================================================ -->
    <section class="breadcrumb-area">
      <div class="breadcrumb-container">
        <h1 class="page-title">INSCRIPCION</h1>
      </div>
    </section>

    <!-- ===========================================================================
        SECCIÓN DEL FORMULARIO
        ============================================================================ -->
    <section class="form-section">
      <div class="form-container">
        <!-- El tag <form> ahora es el contenedor de la rejilla -->
        <form @submit.prevent="handleSubmit" class="student-form">

          <!-- Fila 1: DNI, Nombres, Apellidos -->
          <div class="form-group col-span-6 md:col-span-3 lg:col-span-2">
            <label for="dni" class="form-label">DNI</label>
            <div class="relative">
              <input id="dni" v-model="dni" type="text" placeholder="Tu número de DNI" required class="form-input pr-12" pattern="[0-9]{8}" maxlength="8">
              <button
                type="button"
                @click="handleDniSearch"
                :disabled="isSearchingDni || dni.length !== 8"
                class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-primary disabled:cursor-not-allowed disabled:text-gray-600 transition-colors"
                aria-label="Buscar DNI"
              >
                <Icon v-if="isSearchingDni" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" />
                <Icon v-else name="heroicons:magnifying-glass" class="h-5 w-5" />
              </button>
            </div>
            <small class="form-hint">De 8 dígitos. Presiona la lupa para buscar.</small>
          </div>

          <div class="form-group col-span-6 md:col-span-3 lg:col-span-2">
            <label for="nombres" class="form-label">Nombres</label>
            <input id="nombres" v-model="nombres" type="text" placeholder="Nombres (autocompletado)" readonly class="form-input" :class="{ 'input-filled': nombres }">
          </div>

          <div class="form-group col-span-6 md:col-span-3 lg:col-span-2">
            <label for="apellidos" class="form-label">Apellidos</label>
            <input id="apellidos" v-model="apellidos" type="text" placeholder="Apellidos (autocompletado)" readonly class="form-input" :class="{ 'input-filled': apellidos }">
          </div>

          <!-- Fila 2: Correo, Celular -->
          <div class="form-group col-span-6 md:col-span-3">
            <label for="email" class="form-label">Correo electrónico</label>
            <input id="email" v-model="email" type="email" placeholder="Tu correo electrónico" required class="form-input">
            <small class="form-hint">Debe ser el correo institucional</small>
          </div>

          <div class="form-group col-span-6 md:col-span-3">
            <label for="celular" class="form-label">Celular</label>
            <input id="celular" v-model="celular" type="tel" placeholder="Tu número de celular" required class="form-input" pattern="[9][0-9]{8}" maxlength="9">
            <small class="form-hint">De 9 digitos y sin espacios</small>
          </div>

          <!-- Línea Divisoria -->
          <div class="col-span-6">
            <div class="w-full border-t border-slate-700"></div>
          </div>



          <!-- Fila 4: Contenedor complejo -->
          <div class="col-span-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">

            <!-- Columna Izquierda de Fila 4 -->
            <div class="conditional-section flex flex-col justify-center">
              <div class="form-group">
                <label class="form-label">Modalidad de Depósito</label>
                <div class="radio-group-horizontal">
                  <label for="bancoNacion" class="radio-label">
                    <input id="bancoNacion" v-model="modalidadDeposito" type="radio" value="banco" class="sr-only">
                    <div class="radio-custom-indicator" :class="{ 'selected': modalidadDeposito === 'banco' }">
                      <div v-if="modalidadDeposito === 'banco'" class="radio-dot"></div>
                    </div>
                    <div class="relative flex items-center group">
                      <span>Banco de la Nación</span>
                      <Icon @click.prevent.stop name="heroicons:information-circle" class="ml-2 text-gray-400 cursor-pointer h-6 w-6"/>
                      <div class="tooltip">
                        <div>- N° Cuenta: 04-029-958659</div>
                        <div>(Cendy Girao)</div>
                        <div class="tooltip-arrow"></div>
                      </div>
                    </div>
                  </label>
                  <label for="billeteraDigital" class="radio-label">
                    <input id="billeteraDigital" v-model="modalidadDeposito" type="radio" value="billetera" class="sr-only">
                    <div class="radio-custom-indicator" :class="{ 'selected': modalidadDeposito === 'billetera' }">
                      <div v-if="modalidadDeposito === 'billetera'" class="radio-dot"></div>
                    </div>
                    <div class="relative flex items-center group">
                      <span>Billetera Digital</span>
                      <Icon @click.prevent.stop name="heroicons:information-circle" class="ml-2 text-gray-400 cursor-pointer h-6 w-6"/>
                      <div class="tooltip">
                        <div>Número de Yape: 987654321</div>
                        <div>UNDC</div>
                        <div class="tooltip-arrow"></div>
                      </div>
                    </div>
                  </label>
                </div>
                <small class="form-hint">Seleccionar el medio de pago</small>
              </div>
              <Transition name="fade" mode="out-in">
                <div v-if="modalidadDeposito === 'banco'" class="form-group mt-4">
                  <label class="form-label">Tipo de Pago</label>
                  <div class="radio-group-horizontal">
                    <label for="pagoDirecto" class="radio-label">
                      <input id="pagoDirecto" v-model="tipoPago" type="radio" value="directo" class="sr-only">
                      <div class="radio-custom-indicator" :class="{ 'selected': tipoPago === 'directo' }">
                        <div v-if="tipoPago === 'directo'" class="radio-dot"></div>
                      </div>
                      <span>Pago Directo</span>
                    </label>
                    <label for="pagoInterbancario" class="radio-label">
                      <input id="pagoInterbancario" v-model="tipoPago" type="radio" value="interbancario" class="sr-only">
                      <div class="radio-custom-indicator" :class="{ 'selected': tipoPago === 'interbancario' }">
                        <div v-if="tipoPago === 'interbancario'" class="radio-dot"></div>
                      </div>
                      <span>Pago interbancario</span>
                    </label>
                  </div>
                  <small class="form-hint">Seleccionar el tipo de pago</small>
                </div>
                <div v-else-if="modalidadDeposito === 'billetera'" class="form-group mt-4">
                  <label class="form-label">Aplicativo</label>
                  <div class="radio-group-horizontal">
                    <label for="yape" class="radio-label">
                      <input id="yape" v-model="aplicativo" type="radio" value="yape" class="sr-only">
                      <div class="radio-custom-indicator" :class="{ 'selected': aplicativo === 'yape' }">
                        <div v-if="aplicativo === 'yape'" class="radio-dot"></div>
                      </div>
                      <span>Yape</span>
                    </label>
                    <label for="plin" class="radio-label">
                      <input id="plin" v-model="aplicativo" type="radio" value="plin" class="sr-only">
                      <div class="radio-custom-indicator" :class="{ 'selected': aplicativo === 'plin' }">
                        <div v-if="aplicativo === 'plin'" class="radio-dot"></div>
                      </div>
                      <span>Plin</span>
                    </label>
                  </div>
                  <small class="form-hint">Seleccionar el aplicativo</small>
                </div>
              </Transition>
            </div>

            <!-- Columna Derecha de Fila 4 (con sub-filas) -->
            <div class="flex flex-col justify-between gap-y-8">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                <div class="form-group">
                  <label for="codigoVoucher" class="form-label">Código del voucher de pago</label>
                  <input id="codigoVoucher" v-model="codigoVoucher" type="text" placeholder="Código de operación" required class="form-input">
                  <small class="form-hint">Digitar codigo de pago</small>
                </div>
                <div class="form-group">
                  <label for="fechaPago" class="form-label">Fecha de Pago</label>
                  <input id="fechaPago" v-model="fechaPago" type="date" required class="form-input">
                  <small class="form-hint">Indicar la fecha de pago</small>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Adjuntar voucher de pago</label>
                <label for="archivoVoucher" class="file-input-wrapper" :class="{ 'file-input-completed': archivoVoucher }">
                  <div class="file-input-button">Seleccionar archivo</div>
                  <div class="file-input-text-area">{{ archivoVoucher ? archivoVoucher.name : 'Sin archivos seleccionados' }}</div>
                </label>
                <input id="archivoVoucher" type="file" @change="handleFileChange" required class="sr-only">
                <small class="form-hint">Subir el voucher en JPG, JPEG, PNG O PDF</small>
              </div>
            </div>
          </div>

          <!-- Fila 5: Submit Button -->
          <div class="col-span-6">
            <button type="submit" class="submit-button">
              Registrar Inscripción
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// ===========================================================================
// SEO Y META TAGS
// ===========================================================================

useHead({
  title: 'Registro de Estudiantes - CIISIC',
  meta: [
    { name: 'description', content: 'Formulario de registro para estudiantes del congreso CIISIC.' }
  ]
})

// ===========================================================================
// DATOS ESTÁTICOS Y CONFIGURACIÓN
// ===========================================================================

const dniDatabase: { [key: string]: { nombres: string; apellidos: string } } = {
  '12345678': { nombres: 'Juan Alberto', apellidos: 'Pérez García' },
  '87654321': { nombres: 'Ana María', apellidos: 'López Martinez' },
  '11223344': { nombres: 'Luis Fernando', apellidos: 'Gonzales Torres' }
};

// ===========================================================================
// ESTADO DEL FORMULARIO (REFS)
// ===========================================================================

const dni = ref<string>('');
const nombres = ref<string>('');
const apellidos = ref<string>('');
const email = ref<string>('');
const celular = ref<string>('');
const modalidadDeposito = ref<'banco' | 'billetera'>('banco');
const fechaPago = ref<string>('');
const codigoVoucher = ref<string>('');
const archivoVoucher = ref<File | null>(null);
const tipoPago = ref<'directo' | 'interbancario' | null>(null);
const aplicativo = ref<'yape' | 'plin' | null>(null);
const isSearchingDni = ref(false);

// ===========================================================================
// WATCHERS
// ===========================================================================

watch(modalidadDeposito, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    tipoPago.value = null;
    aplicativo.value = null;
  }
});

// ===========================================================================
// MANEJADORES DE EVENTOS (HANDLERS)
// ===========================================================================

const handleDniSearch = async () => {
  if (dni.value.length !== 8) {
    alert('Por favor, ingrese un DNI válido de 8 dígitos.');
    return;
  }
  isSearchingDni.value = true;
  nombres.value = '';
  apellidos.value = '';
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const result = dniDatabase[dni.value];
    if (result) {
      nombres.value = result.nombres;
      apellidos.value = result.apellidos;
    } else {
      alert('DNI no encontrado.');
    }
  } catch (error) {
    console.error('Error en la búsqueda de DNI:', error);
    alert('Ocurrió un error al buscar el DNI.');
  } finally {
    isSearchingDni.value = false;
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files ? target.files.item(0) : null;
  if (file && !['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
    alert('Solo se permiten archivos JPG, PNG o PDF');
    target.value = '';
    return;
  }
  if (file && file.size > 5 * 1024 * 1024) {
    alert('El archivo no debe superar los 5MB');
    target.value = '';
    return;
  }
  archivoVoucher.value = file;
};

const handleSubmit = () => {
  const metodoDePagoDetallado = modalidadDeposito.value === 'banco' ? tipoPago.value : aplicativo.value;
  const formData = {
    dni: dni.value,
    nombres: nombres.value,
    apellidos: apellidos.value,
    email: email.value,
    celular: celular.value,
    modalidadDeposito: modalidadDeposito.value,
    tipoPago: metodoDePagoDetallado,
    fechaPago: fechaPago.value,
    codigoVoucher: codigoVoucher.value,
    archivoVoucher: archivoVoucher.value ? archivoVoucher.value.name : null,
  };
  console.log('Formulario enviado. Datos:', formData);
  alert('Inscripción enviada. Revisa la consola para ver los datos.');
};
</script>

<style scoped>
/* Page Layout & Banners */
.breadcrumb-area {
  position: relative;
  padding-top: 3.5rem;
  padding-bottom: 3.5rem;
  z-index: 1;
}
.breadcrumb-area::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/images/bg/breadcrumb_bg01.jpg');
  background-size: cover;
  background-position: center;
  z-index: -1;
}
.breadcrumb-container {
  max-width: 1320px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-title {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  text-align: center;
}
.form-section {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
.form-container {
  max-width: 80rem; /* 1280px */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Form Styling */
.student-form {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1.5rem;
  row-gap: 2rem;
}

.form-group {
  width: 100%;
}
.form-label {
  display: block;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.5rem;
}
.form-input,
select.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #1e293b;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  color: #ffffff;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
.form-input::placeholder {
  color: #94a3b8;
}
.form-input:focus,
select.form-input:focus {
  outline: none;
  border-color: #45f882;
  box-shadow: 0 0 0 2px rgba(69, 248, 130, 0.2);
}
select.form-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
.form-input[readonly] {
    cursor: not-allowed;
}
.input-filled {
  background-color: #334155; /* secondary-700 */
}

.form-input:valid {
  background-color: #334155;
}
select.form-input:valid {
  background-color: #334155;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #334155 inset !important;
    -webkit-text-fill-color: #ffffff !important;
    transition: background-color 5000s ease-in-out 0s;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

select.form-input:not(:valid) {
  color: #94a3b8;
}
input[type="date"]:not(:valid) {
  color: #94a3b8;
}
select.form-input:valid,
input[type="date"]:valid {
  color: #ffffff;
}

.form-hint {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #94a3b8;
  font-style: italic;
}

/* Radio Button Styling */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.radio-group-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
}
.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.875rem;
  color: #cbd5e1;
}
.radio-custom-indicator {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #475569;
  border-radius: 9999px;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms;
}
.radio-custom-indicator.selected {
  background-color: #45f882;
  border-color: #45f882;
}
.radio-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #000000;
}

/* File Input Styling */
.file-input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #1e293b;
  border: 1px solid #475569;
  border-radius: 0.5rem;
  transition: all 300ms;
  cursor: pointer;
  overflow: hidden;
}
.file-input-wrapper:hover {
  border-color: #45f882;
}
.file-input-wrapper.file-input-completed {
  background-color: #334155;
}
.file-input-button {
  background-color: #475569;
  color: #ffffff;
  padding: 0.75rem 1rem;
  white-space: nowrap;
  transition: background-color 300ms;
}
.file-input-wrapper:hover .file-input-button {
  background-color: #5a6a7e;
}
.file-input-text-area {
  padding: 0.75rem 1rem;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}
.file-input-wrapper.file-input-completed .file-input-text-area {
  color: #ffffff;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Submit Button */
.submit-button {
  width: 100%;
  background-color: #45f882;
  color: #000000;
  font-weight: 600;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 300ms;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tooltip Styling */
.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: #111827;
  color: #ffffff;
  font-size: 0.75rem;
  border-radius: 0.375rem;
  text-align: left;
  min-width: max-content;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  pointer-events: none;
  z-index: 10;
}
.group:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(-5px);
}
.tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #111827;
}

/* Conditional Section Styling */
.conditional-section {
  background-color: rgba(30, 41, 59, 0.5);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #475569;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive title */
@media (min-width: 640px) {
  .page-title {
    font-size: 3rem;
    line-height: 1;
  }
}
</style>
