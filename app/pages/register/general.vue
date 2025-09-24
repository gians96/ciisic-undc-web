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
          <!-- Campo DNI -->
          <div class="form-group col-span-6 md:col-span-3 lg:col-span-2">
    <label for="dni" class="form-label">DNI</label>
    <div class="relative">
      <input
        id="dni"
        v-model="dni"
        type="text"
        placeholder="Tu número de DNI"
        required
        class="form-input pr-12 border-r-0 rounded-r-none"
        :class="{
          '!border-red-600': isDniInvalid,
          'focus:!border-red-600': isDniInvalid,
          'focus:!ring-red-600/30': isDniInvalid
        }"
        pattern="[0-9]{8}"
        maxlength="8"
        @focus="isDniFocused = true"
        @blur="validateDniOnBlur(); isDniFocused = false"
        @input="isDniInvalid = false"
      >
      <button
        type="button"
        @click="handleDniSearch"
        :disabled="isSearchingDni || dni.length !== 8"
        :class="['absolute inset-y-0 right-0 flex items-center rounded-r-lg px-4 bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-primary disabled:cursor-not-allowed disabled:text-gray-500 disabled:bg-slate-800 transition-colors border-y border-r', isDniInvalid ? '!border-red-600' : (isDniFocused ? 'border-primary' : 'border-slate-700')]"
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
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Tu correo electrónico"
              required
              class="form-input"
              :class="{
                '!border-red-600': isEmailInvalid,
                'focus:!border-red-600': isEmailInvalid,
                'focus:!ring-red-600/30': isEmailInvalid
              }"
              @blur="validateEmailOnBlur"
              @input="isEmailInvalid = false"
            >
            <small class="form-hint">Debe ser un correo valido</small>
          </div>

          <div class="form-group col-span-6 md:col-span-3">
            <label for="celular" class="form-label">Celular</label>
                        <input
              id="celular"
              v-model="celular"
              type="tel"
              placeholder="Tu número de celular"
              required
              class="form-input"
              :class="{
                '!border-red-600': isCelularInvalid,
                'focus:!border-red-600': isCelularInvalid,
                'focus:!ring-red-600/30': isCelularInvalid
              }"
              pattern="[0-9]{9}"
              maxlength="9"
              @blur="validateCelularOnBlur"
              @input="isCelularInvalid = false"
            >
            <small class="form-hint">De 9 digitos y sin espacios</small>
          </div>

          <!-- Línea Divisoria -->
          <div class="col-span-6">
            <div class="w-full border-t border-slate-700"></div>
          </div>



          <!-- Fila 4: Contenedor complejo -->
          <div class="col-span-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">

            <!-- Columna Izquierda de Fila 4 (Reestructurada) -->
            <div class="conditional-section grid grid-cols-1 md:grid-cols-2 gap-x-8 items-center">
              <!-- Sub-columna 1: Controles de Pago -->
              <div class="flex flex-col justify-center space-y-4">
                <div class="form-group">
                  <label class="form-label">Modalidad de Depósito</label>
                  <div class="radio-group-horizontal">
                    <label v-for="method in depositMethods" :key="method.id" :for="`deposit-${method.id}`" class="radio-label">
                      <input :id="`deposit-${method.id}`" v-model="selectedDepositMethodId" type="radio" :value="method.id" class="sr-only">
                      <div class="radio-custom-indicator" :class="{ 'selected': selectedDepositMethodId === method.id }">
                        <div v-if="selectedDepositMethodId === method.id" class="radio-dot"></div>
                      </div>
                      <span>{{ method.nombre }}</span>
                    </label>
                  </div>
                  <small class="form-hint">Seleccionar el medio de pago</small>
                </div>
                <Transition name="fade" mode="out-in">
                  <div v-if="filteredPaymentTypes.length > 0" class="form-group">
                    <label class="form-label">{{ selectedDepositMethod?.nombre === 'Billetera Digital' ? 'Aplicativo' : 'Tipo de Pago' }}</label>
                    <div class="radio-group-horizontal">
                      <label v-for="option in filteredPaymentTypes" :key="option.id" :for="`payment-type-${option.id}`" class="radio-label">
                        <input :id="`payment-type-${option.id}`" v-model="selectedPaymentTypeId" type="radio" :value="option.id" class="sr-only">
                        <div class="radio-custom-indicator" :class="{ 'selected': selectedPaymentTypeId === option.id }">
                          <div v-if="selectedPaymentTypeId === option.id" class="radio-dot"></div>
                        </div>
                        <span>{{ option.nombre }}</span>
                      </label>
                    </div>
                    <small class="form-hint">Seleccionar una opción</small>
                  </div>
                </Transition>
              </div>

              <!-- Sub-columna 2: Información de Cuenta -->
              <Transition name="fade" mode="out-in">
                <div v-if="selectedDepositMethod?.nombre === 'Banco de la Nación'" class="bg-slate-900/70 border border-slate-700 rounded-lg p-4 h-full">
                  <h4 class="font-bold text-primary mb-2 text-sm uppercase">Datos de la cuenta</h4>
                  <div class="text-slate-200 space-y-2 text-sm">
                    <p><span class="font-semibold text-slate-400 mr-2">Titular:</span> JoseMaría Caballa Garay</p>
                    <p><span class="font-semibold text-slate-400 mr-2">N° Cta:</span> <span class="font-mono tracking-wider text-white">255-10957977-0-98</span></p>
                    <p><span class="font-semibold text-slate-400 mr-2">CCI:</span> <span class="font-mono tracking-wider text-white">002-25511095797709881</span></p>
                  </div>
                </div>
                <div v-else-if="selectedDepositMethod?.nombre === 'Billetera Digital'" class="bg-slate-900/70 border border-slate-700 rounded-lg p-4 h-full flex flex-col">
                  <h4 class="font-bold text-primary mb-2 text-sm uppercase">Datos para Yape/Plin</h4>
                  <div class="text-slate-200 space-y-2 text-sm">
                    <p><span class="font-semibold text-slate-400 mr-2">Titular:</span> JoseMaría Caballa Garay</p>
                    <p><span class="font-semibold text-slate-400 mr-2">Número:</span> <span class="font-mono tracking-wider text-white">987654321</span></p>
                  </div>
                  <div class="mt-4 pt-4 border-t border-slate-700 flex-grow flex items-center justify-center">
                    <div class="grid grid-cols-2 gap-4">
                      <div class="text-center">
                        <img @click="openModal('https://pepestubroaster.com/wp-content/uploads/QR-Yape-Pepes-Tu-Broaster.jpg')" src="https://pepestubroaster.com/wp-content/uploads/QR-Yape-Pepes-Tu-Broaster.jpg" alt="QR Yape" class="rounded-md border-2 border-slate-600 hover:border-primary transition-colors cursor-pointer">
                        <span class="text-xs text-slate-400 mt-2 block">QR Yape</span>
                      </div>
                      <div class="text-center">
                        <img @click="openModal('https://www.gicaingenieros.com/sst29783/assets/qr-plin-luisa.png')" src="https://www.gicaingenieros.com/sst29783/assets/qr-plin-luisa.png" alt="QR Plin" class="rounded-md border-2 border-slate-600 hover:border-primary transition-colors cursor-pointer">
                        <span class="text-xs text-slate-400 mt-2 block">QR Plin</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <!-- Columna Derecha de Fila 4 (con sub-filas) -->
            <div class="flex flex-col justify-start gap-y-8">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                <div class="form-group">
                  <label for="codigoVoucher" class="form-label">Código del voucher de pago</label>
                  <input
                    id="codigoVoucher"
                    v-model="codigoVoucher"
                    type="text"
                    placeholder="Código de operación"
                    required
                    class="form-input"
                    :class="{
                      '!border-red-600': isCodigoVoucherInvalid,
                      'focus:!border-red-600': isCodigoVoucherInvalid,
                      'focus:!ring-red-600/30': isCodigoVoucherInvalid
                    }"
                    @blur="validateCodigoVoucherOnBlur"
                    @input="isCodigoVoucherInvalid = false"
                  >
                  <small class="form-hint">Digitar codigo de pago</small>
                </div>
                <div class="form-group">
                  <label for="fechaPago" class="form-label">Fecha de Pago</label>
                  <input
                    id="fechaPago"
                    v-model="fechaPago"
                    type="date"
                    required
                    class="form-input"
                    :class="{
                      '!border-red-600': isFechaPagoInvalid,
                      'focus:!border-red-600': isFechaPagoInvalid,
                      'focus:!ring-red-600/30': isFechaPagoInvalid
                    }"
                    @blur="validateFechaPagoOnBlur"
                    @input="isFechaPagoInvalid = false"
                  >
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

    <!-- Modal para QR -->
    <Transition name="fade">
      <div v-if="isModalOpen" @click="closeModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div @click.stop class="relative max-w-sm w-full">
          <img :src="modalImageUrl" alt="Código QR" class="rounded-lg w-full">
          <button @click="closeModal" class="absolute -top-2 -right-2 bg-primary text-black rounded-full h-8 w-8 flex items-center justify-center">
            <Icon name="heroicons:x-mark" class="h-6 w-6" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

// ===========================================================================
// DEFINICIÓN DE TIPOS
// ===========================================================================

interface DepositMethod {
  id: number;
  nombre: string;
}

interface PaymentType {
  id: number;
  metodoDepositoId: number;
  nombre: string;
}

// ===========================================================================
// LLAMADO A API RENIEC
// ===========================================================================

const dni = ref("")
const isDniInvalid = ref(false)
const isDniFocused = ref(false)
const isSearchingDni = ref(false)
const nombres = ref("")
const apellidos = ref("")

const validateDniOnBlur = () => {
  if (dni.value.length !== 8) {
    isDniInvalid.value = true
  }
}

const handleDniSearch = async () => {
  if (dni.value.length !== 8) return
  isSearchingDni.value = true
  try {
    const response = await fetch(`http://localhost:3001/api/v1/reniec/dni?number=${dni.value}`)
    if (!response.ok) throw new Error("Error en la consulta")
    const data = await response.json()
    nombres.value = data.first_name
    apellidos.value = `${data.first_last_name} ${data.second_last_name}`
  } catch (error) {
    console.error("Error buscando DNI:", error)
    isDniInvalid.value = true
  } finally {
    isSearchingDni.value = false
  }
}

// ===========================================================================
// SEO Y META TAGS
// ===========================================================================

useHead({
  title: 'Registro General - CIISIC',
  meta: [
    { name: 'description', content: 'Formulario de registro general para el congreso CIISIC.' }
  ]
})

// ===========================================================================
// ESTADO DEL FORMULARIO (REFS)
// ===========================================================================

const email = ref<string>('');
const celular = ref<string>('');
const selectedDepositMethodId = ref<number | null>(null);
const fechaPago = ref<string>('');
const codigoVoucher = ref<string>('');
const archivoVoucher = ref<File | null>(null);
const selectedPaymentTypeId = ref<number | null>(null);
const isEmailInvalid = ref(false);
const isCelularInvalid = ref(false);
const isCodigoVoucherInvalid = ref(false);
const isFechaPagoInvalid = ref(false);

const isModalOpen = ref(false);
const modalImageUrl = ref('');

const openModal = (imageUrl: string) => {
  modalImageUrl.value = imageUrl;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  modalImageUrl.value = '';
};

// ===========================================================================
// LÓGICA DE DATOS DINÁMICOS (API)
// ===========================================================================

const depositMethods = ref<DepositMethod[]>([]);
const allPaymentTypes = ref<PaymentType[]>([]);

const { data: fetchedData, pending, error } = await useAsyncData('paymentData', async () => {
  const [depositMethodData, paymentTypeData] = await Promise.all([
    $fetch<DepositMethod[]>('http://localhost:3001/api/v1/deposit-method'),
    $fetch<PaymentType[]>('http://localhost:3001/api/v1/payment-type')
  ]);
  return { depositMethodData, paymentTypeData };
});

if (fetchedData.value) {
  depositMethods.value = fetchedData.value.depositMethodData;
  allPaymentTypes.value = fetchedData.value.paymentTypeData;

  if (!selectedDepositMethodId.value && depositMethods.value.length > 0) {
      selectedDepositMethodId.value = depositMethods.value[0].id;
  }
}

// ===========================================================================
// LÓGICA CONDICIONAL DEL FORMULARIO
// ===========================================================================

const selectedDepositMethod = computed(() => {
  return depositMethods.value.find(method => method.id === selectedDepositMethodId.value) || null;
});

const filteredPaymentTypes = computed(() => {
  if (!selectedDepositMethodId.value) return [];
  return allPaymentTypes.value.filter(pt => pt.metodoDepositoId === selectedDepositMethodId.value);
});

// ===========================================================================
// MANEJADOR DE TECLADO
// ===========================================================================

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isModalOpen.value) {
    closeModal();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

// ===========================================================================
// WATCHERS
// ===========================================================================

watch(selectedDepositMethodId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    selectedPaymentTypeId.value = null;
  }
});

// ===========================================================================
// LÓGICA DE VALIDACIÓN
// ===========================================================================

const validateEmailOnBlur = () => {
  if (!email.value) {
    isEmailInvalid.value = false;
    return;
  }
  const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  isEmailInvalid.value = !emailPattern.test(email.value);
};

const validateCelularOnBlur = () => {
  if (!celular.value) {
    isCelularInvalid.value = false;
    return;
  }
  const celularPattern = /^[0-9]{9}$/;
  isCelularInvalid.value = !celularPattern.test(celular.value);
};

const validateCodigoVoucherOnBlur = () => {
  if (!codigoVoucher.value) {
    isCodigoVoucherInvalid.value = false;
    return;
  }
  const voucherPattern = /^[0-9]+$/;
  isCodigoVoucherInvalid.value = !voucherPattern.test(codigoVoucher.value);
};

const validateFechaPagoOnBlur = () => {
  if (!fechaPago.value) {
    isFechaPagoInvalid.value = false;
    return;
  }
  const year = fechaPago.value.split('-')[0];
  isFechaPagoInvalid.value = year !== '2025';
};

// ===========================================================================
// MANEJADORES DE EVENTOS (HANDLERS)
// ===========================================================================

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
  // Validación para nombres y apellidos
  if (!nombres.value || !apellidos.value) {
    alert('Por favor, realiza una búsqueda de DNI válida para autocompletar tus nombres y apellidos antes de registrar.');
    return; // Detiene el envío del formulario
  }

  // Validación para Tipo de Pago
  if (selectedDepositMethodId.value && !selectedPaymentTypeId.value) {
    alert('Por favor, selecciona un tipo de pago o aplicativo.');
    return;
  }

  const depositMethodName = depositMethods.value.find(m => m.id === selectedDepositMethodId.value)?.nombre || null;
  const paymentTypeName = allPaymentTypes.value.find(p => p.id === selectedPaymentTypeId.value)?.nombre || null;

  const formData = {
    dni: dni.value,
    nombres: nombres.value,
    apellidos: apellidos.value,
    email: email.value,
    celular: celular.value,
    modalidadDeposito: depositMethodName,
    tipoPago: paymentTypeName,
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
