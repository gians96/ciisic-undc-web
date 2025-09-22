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
                <Icon name="heroicons:shield-check" class="h-6 w-6 mr-3 text-primary" />
                1. Introducción
              </h2>
              <div class="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  En MYKD, respetamos tu privacidad y nos comprometemos a proteger 
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
                <Icon name="heroicons:document-magnifying-glass" class="h-6 w-6 mr-3 text-primary" />
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
                        <span>Fecha de nacimiento</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>País de residencia</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Información de pago (encriptada)</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Información de Uso -->
                  <div class="bg-secondary-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">
                      Información de Uso
                    </h3>
                    <ul class="space-y-2 text-sm">
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Actividad en torneos</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Estadísticas de juego</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Preferencias de configuración</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Historial de navegación en la plataforma</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Interacciones sociales (chats, equipos)</span>
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
                        <span>Cookies y tecnologías similares</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Datos de rendimiento y errores</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Información de Terceros -->
                  <div class="bg-secondary-700 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-primary mb-3">
                      Información de Terceros
                    </h3>
                    <ul class="space-y-2 text-sm">
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Datos de redes sociales (si vinculas tu cuenta)</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Información de proveedores de pago</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Estadísticas de juegos (APIs oficiales)</span>
                      </li>
                      <li class="flex items-start">
                        <Icon name="heroicons:check" class="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Servicios de verificación de identidad</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- 3. Cómo Usamos tu Información -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                <Icon name="heroicons:cog-6-tooth" class="h-6 w-6 mr-3 text-primary" />
                3. Cómo Usamos tu Información
              </h2>
              <div class="text-gray-300 space-y-4">
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <Icon name="heroicons:play" class="h-8 w-8 text-blue-400 mb-3" />
                    <h4 class="font-semibold text-blue-400 mb-2">Servicios Principales</h4>
                    <ul class="text-sm space-y-1">
                      <li>• Gestionar tu cuenta</li>
                      <li>• Procesar registros en torneos</li>
                      <li>• Calcular rankings y estadísticas</li>
                      <li>• Facilitar el matchmaking</li>
                    </ul>
                  </div>
                  
                  <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <Icon name="heroicons:envelope" class="h-8 w-8 text-green-400 mb-3" />
                    <h4 class="font-semibold text-green-400 mb-2">Comunicación</h4>
                    <ul class="text-sm space-y-1">
                      <li>• Notificaciones de torneos</li>
                      <li>• Actualizaciones de cuenta</li>
                      <li>• Soporte técnico</li>
                      <li>• Newsletter (opcional)</li>
                    </ul>
                  </div>
                  
                  <div class="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                    <Icon name="heroicons:chart-bar" class="h-8 w-8 text-purple-400 mb-3" />
                    <h4 class="font-semibold text-purple-400 mb-2">Mejoras</h4>
                    <ul class="text-sm space-y-1">
                      <li>• Análisis de uso</li>
                      <li>• Optimización de rendimiento</li>
                      <li>• Desarrollo de nuevas características</li>
                      <li>• Prevención de fraude</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <!-- 4. Compartir Información -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                <Icon name="heroicons:share" class="h-6 w-6 mr-3 text-primary" />
                4. Cuándo Compartimos tu Información
              </h2>
              <div class="text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Compartimos tu información solo en circunstancias específicas y limitadas:
                </p>
                <div class="space-y-4">
                  <div class="flex items-start bg-secondary-700 rounded-lg p-4">
                    <Icon name="heroicons:building-office" class="h-6 w-6 text-yellow-400 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 class="font-semibold text-yellow-400 mb-2">Proveedores de Servicios</h4>
                      <p class="text-sm">
                        Empresas que nos ayudan a operar la plataforma (hosting, pagos, análisis) 
                        bajo estrictos acuerdos de confidencialidad.
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start bg-secondary-700 rounded-lg p-4">
                    <Icon name="heroicons:scale" class="h-6 w-6 text-red-400 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 class="font-semibold text-red-400 mb-2">Requerimientos Legales</h4>
                      <p class="text-sm">
                        Cuando sea requerido por ley, orden judicial o para proteger 
                        nuestros derechos legales y los de nuestros usuarios.
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-start bg-secondary-700 rounded-lg p-4">
                    <Icon name="heroicons:users" class="h-6 w-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <h4 class="font-semibold text-green-400 mb-2">Información Pública</h4>
                      <p class="text-sm">
                        Estadísticas de juego, rankings y logros que elijas hacer públicos 
                        en tu perfil o en clasificaciones de torneos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 5. Cookies -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                <Icon name="heroicons:globe-alt" class="h-6 w-6 mr-3 text-primary" />
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
                      <tr>
                        <td class="px-4 py-3 font-medium text-primary">Marketing</td>
                        <td class="px-4 py-3">Publicidad personalizada</td>
                        <td class="px-4 py-3">1 año</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p class="text-sm">
                  Puedes gestionar las preferencias de cookies en 
                  <NuxtLink to="/cookies" class="text-primary hover:underline">
                    nuestra página de configuración de cookies
                  </NuxtLink>.
                </p>
              </div>
            </section>

            <!-- 6. Seguridad -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                <Icon name="heroicons:lock-closed" class="h-6 w-6 mr-3 text-primary" />
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
                    <div class="flex items-center bg-secondary-700 rounded-lg p-3">
                      <Icon name="heroicons:shield-check" class="h-5 w-5 text-primary mr-3" />
                      <span class="text-sm">Monitoreo de seguridad 24/7</span>
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
                    <div class="flex items-center bg-secondary-700 rounded-lg p-3">
                      <Icon name="heroicons:shield-check" class="h-5 w-5 text-primary mr-3" />
                      <span class="text-sm">Auditorías de seguridad</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 7. Tus Derechos -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                <Icon name="heroicons:hand-raised" class="h-6 w-6 mr-3 text-primary" />
                7. Tus Derechos
              </h2>
              <div class="text-gray-300 space-y-4">
                <p>Tienes los siguientes derechos respecto a tus datos personales:</p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="bg-secondary-700 rounded-lg p-4">
                    <h4 class="font-semibold text-primary mb-2 flex items-center">
                      <Icon name="heroicons:eye" class="h-4 w-4 mr-2" />
                      Acceso
                    </h4>
                    <p class="text-sm">Solicitar una copia de tus datos personales.</p>
                  </div>
                  
                  <div class="bg-secondary-700 rounded-lg p-4">
                    <h4 class="font-semibold text-primary mb-2 flex items-center">
                      <Icon name="heroicons:pencil" class="h-4 w-4 mr-2" />
                      Rectificación
                    </h4>
                    <p class="text-sm">Corregir información inexacta o incompleta.</p>
                  </div>
                  
                  <div class="bg-secondary-700 rounded-lg p-4">
                    <h4 class="font-semibold text-primary mb-2 flex items-center">
                      <Icon name="heroicons:trash" class="h-4 w-4 mr-2" />
                      Eliminación
                    </h4>
                    <p class="text-sm">Solicitar la eliminación de tus datos.</p>
                  </div>
                  
                  <div class="bg-secondary-700 rounded-lg p-4">
                    <h4 class="font-semibold text-primary mb-2 flex items-center">
                      <Icon name="heroicons:pause" class="h-4 w-4 mr-2" />
                      Limitación
                    </h4>
                    <p class="text-sm">Restringir el procesamiento de tus datos.</p>
                  </div>
                  
                  <div class="bg-secondary-700 rounded-lg p-4">
                    <h4 class="font-semibold text-primary mb-2 flex items-center">
                      <Icon name="heroicons:arrow-right-on-rectangle" class="h-4 w-4 mr-2" />
                      Portabilidad
                    </h4>
                    <p class="text-sm">Recibir tus datos en formato portable.</p>
                  </div>
                  
                  <div class="bg-secondary-700 rounded-lg p-4">
                    <h4 class="font-semibold text-primary mb-2 flex items-center">
                      <Icon name="heroicons:no-symbol" class="h-4 w-4 mr-2" />
                      Oposición
                    </h4>
                    <p class="text-sm">Oponerte al procesamiento de tus datos.</p>
                  </div>
                </div>
                
                <div class="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p class="text-sm">
                    Para ejercer cualquiera de estos derechos, contacta con nosotros en 
                    <a href="mailto:privacy@mykd.gg" class="text-primary hover:underline">privacy@mykd.gg</a>
                  </p>
                </div>
              </div>
            </section>

            <!-- 8. Contacto -->
            <section>
              <h2 class="text-2xl font-bold text-white mb-4 flex items-center">
                <Icon name="heroicons:envelope" class="h-6 w-6 mr-3 text-primary" />
                8. Contacto y Preguntas
              </h2>
              <div class="text-gray-300 space-y-4">
                <p>
                  Si tienes preguntas sobre esta Política de Privacidad o sobre 
                  cómo manejamos tus datos, puedes contactarnos:
                </p>
                <div class="bg-secondary-700 rounded-lg p-6">
                  <div class="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 class="font-semibold text-primary mb-2">Email de Privacidad</h4>
                      <p class="text-sm">privacy@mykd.gg</p>
                    </div>
                    <div>
                      <h4 class="font-semibold text-primary mb-2">Soporte General</h4>
                      <p class="text-sm">support@mykd.gg</p>
                    </div>
                    <div>
                      <h4 class="font-semibold text-primary mb-2">Formulario</h4>
                      <NuxtLink to="/contact" class="text-primary hover:underline text-sm">
                        Página de Contacto
                      </NuxtLink>
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
  title: 'Política de Privacidad - MYKD',
  meta: [
    {
      name: 'description',
      content: 'Política de privacidad de MYKD. Conoce cómo protegemos y manejamos tus datos personales en nuestra plataforma de gaming y esports.'
    }
  ]
})

// ============================================================================
// DATOS
// ============================================================================

const lastUpdated = ref('15 de Enero de 2024')

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
