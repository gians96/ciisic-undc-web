<template>
  <div
    class="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform memorias-card mb-12 mx-4"
  >
    <div class="relative mb-6">
      <img
        :src="imagen"
        :alt="titulo"
        :class="`w-full aspect-square bg-gradient-to-br ${ informacion.fondo } rounded-xl object-cover`"
        loading="lazy"
      />
      <!-- Badge de categoría -->
      <div
        class="absolute -top-2 -right-2 text-black px-3 py-1 rounded-lg text-xs font-bold uppercase"
        :class="informacion.color"
      >
        {{ informacion.texto }}
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="text-xl font-bold text-white">{{ titulo }}</h3>

      <!-- Descripción -->
      <div class="flex items-center space-x-3">
        <div>
          <!-- <p class="text-gray-400 text-xs uppercase">{{ descripcion }}</p> -->
        </div>
      </div>

      <!-- Precio y botón -->
      <div class="flex items-center justify-between pt-4">
        <div>
          <p class="text-white/50 text-lg font-bold">
            <slot name="footer">Gay el que no pone nada</slot>
          </p>
        </div>
        <!-- <button
          class="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200 focus:outline-2 focus:outline-green-500 focus:outline-offset-2"
        >
          Detalles →
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
    default: "Descripción",
  },
  imagen: {
    type: String,
    required: true,
  },
  categoria: {
    type: Number,
    required: false,
    default: 0,
  },
});

const informacion = computed(() => {
  switch (props.categoria) {
    case 1:
      return { texto: "Congreso", color: "bg-orange-500", fondo: "from-orange-400 to-orange-600" };
    case 2:
      return { texto: "eSport", color: "bg-green-500", fondo: "from-green-400 to-green-600" };
    case 3:
      return { texto: "Reinado", color: "bg-purple-500 text-white", fondo: "from-purple-400 to-purple-600" };
    case 4:
      return { texto: "Comparsa", color: "bg-blue-500", fondo: "from-blue-400 to-blue-600" };
    default:
      return { texto: "Sin Categoría", color: "bg-yellow-500", fondo: "from-yellow-400 to-yellow-600" };
  }
});
</script>

<style scoped>
.memorias-card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.memorias-card:hover {
  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.1);
}

/* Efectos de hover para las cartas */
.memorias-card:hover img {
  transform: scale(1.05) rotate(2deg);
  transition: transform 0.3s ease;
}

/* Animaciones de entrada */
.memorias-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .memorias-card {
    margin-bottom: 2rem;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .memorias-card:hover img {
    transform: none;
  }

  .memorias-card {
    animation: none;
  }
}

/* Efectos de glassmorphism */
.memorias-card {
  background: rgba(30, 41, 59, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Focus states mejorados */
button:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}
</style>
