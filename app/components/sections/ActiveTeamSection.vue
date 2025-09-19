<template>
  <section class="py-20 bg-slate-900 relative">
    <div class="max-w-7xl mx-auto px-6 lg:px-8">
      <!-- Título de la sección -->
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">
          Comité General
        </h2>
        <!-- Línea decorativa verde -->
        <div class="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
      </div>

      <!-- Grid de miembros del equipo -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
        <div
          v-for="(member, index) in teamMembers.slice(3)"
          :key="member.id"
          class="team-member-card group"
        >
          <div
            class="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-green-500/50 transition-all duration-300 overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5"
            ></div>
            <div class="relative z-10 flex justify-center mb-6">
              <div
                class="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full border-4 border-green-500 flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="member.image"
                  :src="member.image"
                  :alt="member.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-3xl">{{ member.image }}</div>
              </div>
            </div>
            <div class="relative z-10 text-center">
              <h3 class="text-xl font-bold text-white mb-2">
                {{ member.name }}
              </h3>
              <p
                class="text-green-500 text-sm font-medium uppercase tracking-wider"
              >
                {{ member.role }}
              </p>
            </div>
            <div
              class="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full opacity-60"
            ></div>
            <div
              class="absolute bottom-4 left-4 w-1 h-1 bg-green-500 rounded-full opacity-40"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-8 pt-20">
      <!-- Título de la sección -->
      <div class="text-center mb-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-white mb-4">
          Comité General de Estudiantes
        </h2>
        <!-- Línea decorativa verde -->
        <div class="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
      </div>

      <!-- Grid de miembros del equipo -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
        <div
          v-for="(member, index) in teamMembers.slice(0, 3)"
          :key="member.id"
          class="team-member-card group"
        >
          <div
            class="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-green-500/50 transition-all duration-300 overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/5"
            ></div>
            <div class="relative z-10 flex justify-center mb-6">
              <div
                class="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full border-4 border-green-500 flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="member.image"
                  :src="member.image"
                  :alt="member.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-3xl">{{ member.image }}</div>
              </div>
            </div>
            <div class="relative z-10 text-center">
              <h3 class="text-xl font-bold text-white mb-2">
                {{ member.name }}
              </h3>
              <p
                class="text-green-500 text-sm font-medium uppercase tracking-wider"
              >
                {{ member.role }}
              </p>
            </div>
            <div
              class="absolute top-4 right-4 w-2 h-2 bg-green-500 rounded-full opacity-60"
            ></div>
            <div
              class="absolute bottom-4 left-4 w-1 h-1 bg-green-500 rounded-full opacity-40"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// ============================================================================
// INTERFACES
// ============================================================================

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

// ============================================================================
// DATA
// ============================================================================

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Alexandra Reyna",
    role: "Vicepresidenta",
    image: "/images/team/reyna.jpg",
  },
  {
    id: "2",
    name: "Carolay Delgado",
    role: "Presidenta",
    image: "/images/team/delgado.jpg",
  },
  {
    id: "3",
    name: "Josemaria Caballa",
    role: "tesorero",
    image: "/images/team/caballa.jpg",
  },
  {
    id: "4",
    name: "Dr. Wagner Vicente",
    role: "Chair General",
    image: "/images/team/w-vicente.webp",
  },
  {
    id: "5",
    name: "Ph.D. Dulio Oseda",
    role: "Chair General",
    image: "/images/team/d-oseda.webp",
  },
  {
    id: "6",
    name: "M.Sc. Leonidas Asto",
    role: "Chair General",
    image: "/images/team/l-asto.webp",
  },
  {
    id: "7",
    name: "Dra. Amanda Duran",
    role: "Chair Académico",
    image: "/images/team/a-duran.webp",
  },
  {
    id: "8",
    name: "Dr. Carlos Almidón",
    role: "Chair Académico",
    image: "/images/team/c-almidon.webp",
  },
];

// ============================================================================
// METHODS
// ============================================================================

const viewMember = (memberId: string) => {
  console.log(`Viewing member: ${memberId}`);
  // Lógica para ver perfil del miembro
};
</script>

<style scoped>
/* ============================================================================
   ESTILOS DE ACTIVE TEAM MEMBERS
   ============================================================================ */

/* Efectos para las tarjetas de miembros */
.team-member-card {
  cursor: pointer;
}

.team-member-card:hover {
  transform: translateY(-8px);
  transition: transform 0.3s ease;
}

.team-member-card:hover .bg-slate-800 {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.2);
}

/* Efectos de brillo para los avatares */
.team-member-card:hover .rounded-full {
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.8);
  }
}

/* Animaciones de entrada escalonada */
.team-member-card:nth-child(1) {
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

.team-member-card:nth-child(2) {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.team-member-card:nth-child(3) {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.team-member-card:nth-child(4) {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efectos de partículas flotantes */
.team-member-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 20%,
      rgba(34, 197, 94, 0.1) 0%,
      transparent 30%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(34, 197, 94, 0.05) 0%,
      transparent 30%
    );
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 1rem;
  pointer-events: none;
}

.team-member-card:hover::before {
  opacity: 1;
}

/* Glassmorphism effect */
.team-member-card .bg-slate-800 {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  h2 {
    font-size: 2.5rem !important;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .team-member-card:hover {
    transform: none;
  }

  .team-member-card:hover .rounded-full {
    animation: none;
  }

  .team-member-card {
    animation: none;
  }
}

/* Focus states */
.team-member-card:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

/* Efectos especiales para los bordes */
.team-member-card .border-green-500 {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  padding: 2px;
  border-radius: 50%;
}

.team-member-card .border-green-500 > div {
  border-radius: 50%;
  background: linear-gradient(135deg, #475569, #64748b);
}
</style>
