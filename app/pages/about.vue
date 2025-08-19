<!-- ============================================================================
     PÁGINA ABOUT - NOSOTROS
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
      <div class="custom-container relative">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6">
            Sobre <span class="text-primary">MYKD</span>
          </h1>
          <p class="text-xl text-gray-300 mb-8 leading-relaxed">
            Somos la plataforma líder de eSports donde los jugadores se convierten en leyendas. 
            Nuestra misión es democratizar el gaming competitivo y crear oportunidades para todos.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              to="/tournaments"
              class="btn-primary"
            >
              Ver Torneos
            </NuxtLink>
            <NuxtLink 
              to="/contact"
              class="btn-secondary"
            >
              Contáctanos
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20 bg-secondary-800">
      <div class="custom-container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
              Nuestra Misión
            </h2>
            <p class="text-gray-300 text-lg mb-6 leading-relaxed">
              En MYKD creemos que el gaming es más que entretenimiento: es una pasión, 
              una comunidad y una oportunidad de crecimiento personal y profesional.
            </p>
            <ul class="space-y-4">
              <li class="flex items-start">
                <Icon name="heroicons:check" class="h-6 w-6 text-primary mt-1 mr-3 flex-shrink-0" />
                <span class="text-gray-300">Crear oportunidades para gamers de todos los niveles</span>
              </li>
              <li class="flex items-start">
                <Icon name="heroicons:check" class="h-6 w-6 text-primary mt-1 mr-3 flex-shrink-0" />
                <span class="text-gray-300">Fomentar la competencia justa y el fair play</span>
              </li>
              <li class="flex items-start">
                <Icon name="heroicons:check" class="h-6 w-6 text-primary mt-1 mr-3 flex-shrink-0" />
                <span class="text-gray-300">Construir la comunidad gaming más grande de Latinoamérica</span>
              </li>
            </ul>
          </div>
          <div class="relative">
            <div class="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary-700 rounded-2xl shadow-2xl flex items-center justify-center">
              <Icon name="heroicons:trophy" class="h-24 w-24 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-20">
      <div class="custom-container">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            MYKD en Números
          </h2>
          <p class="text-gray-300 text-lg">
            Nuestra comunidad crece día a día
          </p>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-primary mb-2">500K+</div>
            <div class="text-gray-300">Jugadores Registrados</div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-primary mb-2">1,200+</div>
            <div class="text-gray-300">Torneos Realizados</div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-primary mb-2">50M+</div>
            <div class="text-gray-300">Prize Pool Total</div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-primary mb-2">25+</div>
            <div class="text-gray-300">Países</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-secondary-800">
      <div class="custom-container">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            Nuestro Equipo
          </h2>
          <p class="text-gray-300 text-lg">
            Conoce a las personas que hacen posible MYKD
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Team Member 1 -->
          <div class="bg-secondary-700 rounded-2xl p-6 text-center hover:bg-secondary-600 transition-colors duration-300">
            <div class="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Icon name="heroicons:user" class="h-10 w-10 text-black" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Alex Rodriguez</h3>
            <p class="text-primary mb-2">CEO & Fundador</p>
            <p class="text-gray-300 text-sm">
              Gamer profesional con más de 10 años de experiencia en la industria de los eSports.
            </p>
          </div>
          
          <!-- Team Member 2 -->
          <div class="bg-secondary-700 rounded-2xl p-6 text-center hover:bg-secondary-600 transition-colors duration-300">
            <div class="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Icon name="heroicons:user" class="h-10 w-10 text-black" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Maria González</h3>
            <p class="text-primary mb-2">CTO</p>
            <p class="text-gray-300 text-sm">
              Experta en desarrollo de plataformas gaming con más de 8 años de experiencia.
            </p>
          </div>
          
          <!-- Team Member 3 -->
          <div class="bg-secondary-700 rounded-2xl p-6 text-center hover:bg-secondary-600 transition-colors duration-300">
            <div class="w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Icon name="heroicons:user" class="h-10 w-10 text-black" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Carlos Mendoza</h3>
            <p class="text-primary mb-2">Head of eSports</p>
            <p class="text-gray-300 text-sm">
              Ex-jugador profesional y organizador de eventos con amplia experiencia en torneos.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-20">
      <div class="custom-container">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-white mb-4">
            Nuestros Valores
          </h2>
          <p class="text-gray-300 text-lg">
            Los principios que guían nuestro trabajo
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Icon name="heroicons:trophy" class="h-8 w-8 text-black" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Excelencia</h3>
            <p class="text-gray-300">
              Buscamos la excelencia en cada torneo, cada experiencia y cada interacción con nuestra comunidad.
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Icon name="heroicons:user-group" class="h-8 w-8 text-black" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Comunidad</h3>
            <p class="text-gray-300">
              Creemos en el poder de la comunidad para crear experiencias increíbles y duraderas.
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Icon name="heroicons:rocket-launch" class="h-8 w-8 text-black" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">Innovación</h3>
            <p class="text-gray-300">
              Constantemente innovamos para mantenernos a la vanguardia de la industria gaming.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Sobre Nosotros - MYKD',
  meta: [
    {
      name: 'description',
      content: 'Conoce más sobre MYKD, la plataforma líder de eSports. Nuestra misión, equipo y valores que nos convierten en la comunidad gaming más grande de Latinoamérica.'
    },
    {
      property: 'og:title',
      content: 'Sobre Nosotros - MYKD'
    },
    {
      property: 'og:description',
      content: 'Conoce más sobre MYKD, la plataforma líder de eSports. Nuestra misión, equipo y valores.'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// ============================================================================
// DATOS DE LA PÁGINA
// ============================================================================

const stats = [
  { value: '500K+', label: 'Jugadores Registrados' },
  { value: '1,200+', label: 'Torneos Realizados' },
  { value: '50M+', label: 'Prize Pool Total' },
  { value: '25+', label: 'Países' }
]

const team = [
  {
    name: 'Alex Rodriguez',
    role: 'CEO & Fundador',
    description: 'Gamer profesional con más de 10 años de experiencia en la industria de los eSports.'
  },
  {
    name: 'Maria González',
    role: 'CTO',
    description: 'Experta en desarrollo de plataformas gaming con más de 8 años de experiencia.'
  },
  {
    name: 'Carlos Mendoza',
    role: 'Head of eSports',
    description: 'Ex-jugador profesional y organizador de eventos con amplia experiencia en torneos.'
  }
]

const values = [
  {
    icon: 'heroicons:trophy',
    title: 'Excelencia',
    description: 'Buscamos la excelencia en cada torneo, cada experiencia y cada interacción con nuestra comunidad.'
  },
  {
    icon: 'heroicons:user-group',
    title: 'Comunidad',
    description: 'Creemos en el poder de la comunidad para crear experiencias increíbles y duraderas.'
  },
  {
    icon: 'heroicons:rocket-launch',
    title: 'Innovación',
    description: 'Constantemente innovamos para mantenernos a la vanguardia de la industria gaming.'
  }
]
</script>

<style scoped>
/* ============================================================================
   ESTILOS ESPECÍFICOS DE LA PÁGINA ABOUT
   ============================================================================ */

.btn-primary {
  background-color: #45f882;
  color: black;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: rgba(69, 248, 130, 0.9);
}

.btn-secondary {
  background-color: transparent;
  border: 2px solid #45f882;
  color: #45f882;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #45f882;
  color: black;
}

/* Animaciones para las estadísticas */
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stats-item {
  animation: countUp 0.6s ease-out forwards;
}

/* Hover effects para las tarjetas del equipo */
.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(69, 248, 130, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    line-height: 1.2;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .stats-item,
  .team-card {
    animation: none;
    transition: none;
  }
  
  .team-card:hover {
    transform: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .bg-secondary-700,
  .bg-secondary-800 {
    border: 1px solid #ffffff;
  }
  
  .text-gray-300 {
    color: #ffffff;
  }
}
</style>
