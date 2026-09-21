<!-- ============================================================================
     PÁGINA DE POLÍTICA DE PRIVACIDAD
     ============================================================================ -->

<template>
  <div class="min-h-screen bg-secondary-900 py-20">
    <div class="custom-container">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-6">
            Política de <span class="text-primary">Privacidad</span>
          </h1>
          <p class="text-xl text-gray-300 mb-4">
            Última actualización: {{ lastUpdated }}
          </p>
          <p class="text-gray-400">
            Tu privacidad es importante para nosotros
          </p>
        </div>

        <!-- Content -->
        <div class="prose prose-invert max-w-none">
          <div class="bg-secondary-800 rounded-2xl p-8 space-y-8">
            <!-- 1. Introducción -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                1. Introducción
              </h2>
              <div class="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Respetamos tu privacidad y nos comprometemos a proteger 
                  tus datos personales. Esta Política de Privacidad explica cómo 
                  recopilamos, usamos, almacenamos y protegemos tu información 
                  cuando utilizas nuestros servicios.
                </p>
                <div class="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p class="text-primary font-medium">
                    🔒 Compromiso: Nunca vendemos tus datos personales a terceros.
                  </p>
                </div>
              </div>
            </section>

            <!-- 2. Información que Recopilamos -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                2. Información que Recopilamos
              </h2>
              <div class="text-gray-300 space-y-4">
                <div class="grid md:grid-cols-2 gap-6">
                  <!-- Información Personal -->
                  <div class="bg-secondary-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">
                      Información Personal
                    </h3>
                    <ul class="space-y-2 text-sm">
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Nombre y apellidos</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Dirección de correo electrónico</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>DNI</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Celular</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Información Técnica -->
                  <div class="bg-secondary-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">
                      Información Técnica
                    </h3>
                    <ul class="space-y-2 text-sm">
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Dirección IP</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Tipo de navegador y dispositivo</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Sistema operativo</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Datos de rendimiento y errores</span>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </section>

            <!-- 3. Cómo Usamos tu Información -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                3. Cómo Usamos tu Información
              </h2>
              <div class="text-gray-300 space-y-4">
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <Icon name="heroicons:play" class="h-8 w-8 text-blue-400 mb-3" />
                    <h4 class="font-semibold text-blue-400 mb-2">Servicios Principales</h4>
                    <ul class="text-sm space-y-1">
                      <li>• Gestionar el tipo de usuarios interesados</li>
                      <li>• Procesar registros</li>
                      <li>• Notificar sobre eventos y actualizaciones</li>
                    </ul>
                  </div>
                  
                  <div class="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                    <Icon name="heroicons:chart-bar" class="h-8 w-8 text-purple-400 mb-3" />
                    <h4 class="font-semibold text-purple-400 mb-2">Mejoras</h4>
                    <ul class="text-sm space-y-1">
                      <li>• Análisis de uso</li>
                      <li>• Optimización de rendimiento</li>
                      <li>• Desarrollo de nuevas características</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- 4. Compartir Información -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                4. Cuándo Compartimos tu Información
              </h2>
              <div class="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Compartimos tu información solo en circunstancias específicas y limitadas:
                </p>
                <div class="space-y-4">
                  
                  <div class="flex items-start bg-secondary-700 rounded-lg p-4">
                    <Icon name="heroicons:scale" class="h-6 w-6 text-primary-400 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 class="font-semibold text-primary-400 mb-2">Requerimientos Legales</h4>
                      <p class="text-sm">
                        Cuando sea requerido por ley, orden judicial o para proteger 
                        nuestros derechos legales y los de nuestros usuarios.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 5. Cookies -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                5. Cookies y Tecnologías Similares
              </h2>
              <div class="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Utilizamos cookies y tecnologías similares para mejorar tu experiencia:
                </p>
                <div class="overflow-x-auto">
                  <table class="w-full bg-secondary-700 rounded-lg overflow-hidden">
                    <thead class="bg-primary text-black">
                      <tr>
                        <th class="px-4 py-3 text-left font-semibold">Tipo</th>
                        <th class="px-4 py-3 text-left font-semibold">Propósito</th>
                        <th class="px-4 py-3 text-left font-semibold">Duración</th>
                      </tr>
                    </thead>
                    <tbody class="text-sm">
                      <tr class="border-b border-secondary-600">
                        <td class="px-4 py-3 font-medium text-primary">Esenciales</td>
                        <td class="px-4 py-3">Funcionamiento básico del sitio</td>
                        <td class="px-4 py-3">Sesión</td>
                      </tr>
                      <tr class="border-b border-secondary-600">
                        <td class="px-4 py-3 font-medium text-primary">Funcionales</td>
                        <td class="px-4 py-3">Recordar preferencias</td>
                        <td class="px-4 py-3">1 año</td>
                      </tr>
                      <tr class="border-b border-secondary-600">
                        <td class="px-4 py-3 font-medium text-primary">Analíticas</td>
                        <td class="px-4 py-3">Estadísticas de uso</td>
                        <td class="px-4 py-3">2 años</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- 6. Seguridad -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                6. Seguridad de Datos
              </h2>
              <div class="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Implementamos múltiples capas de seguridad para proteger tu información:
                </p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="space-y-3">
                    <div class="flex items-center bg-secondary-700 rounded-lg p-3">
                      <Icon name="heroicons:shield-check" class="h-5 w-5 text-primary mr-3" />
                      <span class="text-sm">Encriptación SSL/TLS</span>
                    </div>
                    <div class="flex items-center bg-secondary-700 rounded-lg p-3">
                      <Icon name="heroicons:shield-check" class="h-5 w-5 text-primary mr-3" />
                      <span class="text-sm">Autenticación de dos factores</span>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-center bg-secondary-700 rounded-lg p-3">
                      <Icon name="heroicons:shield-check" class="h-5 w-5 text-primary mr-3" />
                      <span class="text-sm">Acceso restringido a datos</span>
                    </div>
                    <div class="flex items-center bg-secondary-700 rounded-lg p-3">
                      <Icon name="heroicons:shield-check" class="h-5 w-5 text-primary mr-3" />
                      <span class="text-sm">Backups seguros regulares</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 7. Contacto -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                7. Contacto y Preguntas
              </h2>
              <div class="text-gray-300 space-y-4">
                <p>
                  Si tienes preguntas sobre esta Política de Privacidad o sobre 
                  cómo manejamos tus datos, puedes contactarnos:
                </p>
                <div class="bg-secondary-700 rounded-lg p-6">
                  <div class="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 class="font-semibold text-primary mb-2">Email de Contacto</h4>
                      <p class="text-sm">congreso@undc.edu.pe</p>
                    </div>
                    <div>
                      <h4 class="font-semibold text-primary mb-2">Soporte General</h4>
                      <a href="https://fi.undc.edu.pe" class="text-sm text-white">fi.undc.edu.pe</a>
                    </div>
                    <div>
                      <h4 class="font-semibold text-primary mb-2">Formulario</h4>
                      <a href="/contacto" class="text-sm text-white">Contacto aqui</a>

                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Back to Top -->
        <div class="text-center mt-16">
          <button
            @click="scrollToTop"
            class="bg-primary hover:bg-primary/90 text-black font-semibold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center mx-auto"
          >
            <Icon name="heroicons:arrow-up" class="h-4 w-4 mr-2" />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ============================================================================
// SEO Y META TAGS
// ============================================================================

useHead({
  title: 'Política de Privacidad | VIII CIISIC',
  meta: [
    {
      name: 'description',
      content: 'Política de privacidad de VIII CIISIC. Conoce cómo protegemos y manejamos tus datos personales en nuestra plataforma.'
    }
  ]
})

// ============================================================================
// DATOS
// ============================================================================

const lastUpdated = ref('14 de septiembre de 2026')

// ============================================================================
// METHODS
// ============================================================================

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
/* ============================================================================
   ESTILOS ESPECÍFICOS DE POLÍTICA DE PRIVACIDAD
   ============================================================================ */

/* Content animation */
.prose {
  animation: fadeInUp 0.8s ease-out;
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

/* Table responsiveness */
@media (max-width: 768px) {
  table {
    font-size: 0.75rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}

/* Link hover effects */
a:hover {
  text-decoration: underline;
  text-decoration-color: rgb(69 248 130);
  text-underline-offset: 4px;
}

/* Section spacing */
section {
  scroll-margin-top: 2rem;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .bg-secondary-700,
  .bg-secondary-800,
  table {
    border: 1px solid #ffffff;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .prose {
    animation: none;
  }
  
  html {
    scroll-behavior: auto;
  }
}
</style>
