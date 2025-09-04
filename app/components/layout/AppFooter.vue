<template>
  <footer class="bg-secondary-900 border-t border-secondary-700">
    <!-- Main Footer Content -->
    <div class="custom-container py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <!-- Brand Section -->
        <div class="lg:col-span-2">
          <!-- Logo -->
          <NuxtLink to="/" class="inline-block mb-6">
            <NuxtImg
              src="/images/logo/logo.png"
              alt="MYKD Logo"
              width="150"
              height="50"
              class="h-10 w-auto"
            />
          </NuxtLink>

          <!-- Description -->
          <p class="text-gray-400 mb-6 max-w-sm">
            La ingeniería de sistemas impulsa la innovación y la investigación
            científica, construyendo soluciones que transforman el futuro.
          </p>

          <!-- Social Links -->
          <div class="flex space-x-4">
            <a
              v-for="social in socialLinks"
              :key="social.platform"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 bg-secondary-800 hover:bg-primary text-gray-400 hover:text-black rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
              :aria-label="`Síguenos en ${social.platform}`"
            >
              <Icon :name="social.icon" class="h-5 w-5" />
            </a>
          </div>
        </div>

        <!-- Navigation Links -->
        <div v-for="(section, key) in footerNavigation" :key="key">
          <h3 class="text-white font-semibold mb-4">{{ section.title }}</h3>
          <ul class="space-y-2">
            <li v-for="link in section.links" :key="link.href">
              <NuxtLink
                v-if="!link.isExternal"
                :to="link.href"
                class="text-gray-400 hover:text-primary transition-colors duration-300"
              >
                {{ link.label }}
              </NuxtLink>
              <a
                v-else
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-primary transition-colors duration-300 flex items-center"
              >
                {{ link.label }}
                <Icon
                  name="heroicons:arrow-top-right-on-square"
                  class="h-3 w-3 ml-1"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Newsletter Section -->
    <div class="border-t border-secondary-700 bg-secondary-800">
      <div class="custom-container py-8">
        <div class="flex flex-col lg:flex-row items-center justify-between">
          <!-- Newsletter Text -->
          <div class="mb-6 lg:mb-0">
            <h3 class="text-xl font-semibold text-white mb-2">
              Mantente actualizado
            </h3>
            <p class="text-gray-400">
              Recibe las últimas noticias sobre torneos, actualizaciones y
              eventos especiales.
            </p>
          </div>

          <!-- Newsletter Form -->
          <form
            @submit.prevent="handleNewsletterSubmit"
            class="flex w-full lg:w-auto"
          >
            <div class="flex flex-1 lg:w-80">
              <input
                v-model="email"
                type="email"
                placeholder="Tu correo electrónico"
                class="flex-1 px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors duration-300"
                required
              />
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-r-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon
                  v-if="isSubmitting"
                  name="heroicons:arrow-path"
                  class="h-5 w-5 animate-spin"
                />
                <span v-else>Suscribirse</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-secondary-700">
      <div class="custom-container py-6">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <!-- Copyright -->
          <div class="text-gray-400 text-sm mb-4 md:mb-0">
            © {{ currentYear }} MYKD. Todos los derechos reservados.
          </div>

          <!-- Legal Links -->
          <div class="flex space-x-6">
            <NuxtLink
              to="/privacy"
              class="text-gray-400 hover:text-primary text-sm transition-colors duration-300"
            >
              Privacidad
            </NuxtLink>
            <NuxtLink
              to="/terms"
              class="text-gray-400 hover:text-primary text-sm transition-colors duration-300"
            >
              Términos
            </NuxtLink>
            <NuxtLink
              to="/cookies"
              class="text-gray-400 hover:text-primary text-sm transition-colors duration-300"
            >
              Cookies
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// ============================================================================
// IMPORTS
// ============================================================================

import { storeToRefs } from "pinia";
import { useNavigationStore } from "~/stores/navigation";
import { useLayoutStore } from "~/stores/layout";

// ============================================================================
// STORES
// ============================================================================

const navigationStore = useNavigationStore();
const layoutStore = useLayoutStore();

const { footerNavigation } = storeToRefs(navigationStore);

// ============================================================================
// ESTADO LOCAL
// ============================================================================

const email = ref("");
const isSubmitting = ref(false);

// ============================================================================
// COMPUTED
// ============================================================================

const currentYear = computed(() => new Date().getFullYear());

const socialLinks = computed(() => [
  {
    platform: "Discord",
    url: "https://discord.gg/mykd",
    icon: "simple-icons:discord",
  },
  {
    platform: "Twitter",
    url: "https://twitter.com/mykd",
    icon: "simple-icons:twitter",
  },
  {
    platform: "YouTube",
    url: "https://youtube.com/mykd",
    icon: "simple-icons:youtube",
  },
  {
    platform: "Twitch",
    url: "https://twitch.tv/mykd",
    icon: "simple-icons:twitch",
  },
  {
    platform: "Instagram",
    url: "https://instagram.com/mykd",
    icon: "simple-icons:instagram",
  },
]);

// ============================================================================
// METHODS
// ============================================================================

const handleNewsletterSubmit = async () => {
  if (!email.value || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    // Aquí iría la lógica para suscribir al newsletter
    // Por ahora simulamos una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    layoutStore.showSuccess("¡Te has suscrito exitosamente!", "Newsletter");
    email.value = "";
  } catch (error) {
    layoutStore.showError(
      "Error al suscribirse. Inténtalo de nuevo.",
      "Newsletter"
    );
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
/* ============================================================================
   ESTILOS DEL FOOTER
   ============================================================================ */

/* Hover effects para los social links */
.social-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(69, 248, 130, 0.3);
}

/* Estilos para el formulario de newsletter */
.newsletter-form {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.newsletter-input:focus {
  box-shadow: 0 0 0 3px rgba(69, 248, 130, 0.1);
}

/* Animaciones suaves */
.footer-link {
  position: relative;
}

.footer-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--tg-theme-primary);
  transition: width 0.3s ease;
}

.footer-link:hover::after {
  width: 100%;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .newsletter-form {
    flex-direction: column;
    gap: 0.5rem;
  }

  .newsletter-input,
  .newsletter-button {
    border-radius: 0.5rem;
  }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  .newsletter-input {
    color-scheme: dark;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .social-link:hover {
    transform: none;
  }

  .footer-link::after {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .text-gray-400 {
    color: #ffffff;
  }

  .border-secondary-700 {
    border-color: #ffffff;
  }
}
</style>
