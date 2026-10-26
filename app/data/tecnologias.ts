/** Catálogo de tecnologías de la credencial 3D (spec 013).
 *
 * Para «administrar» las tecnologías (agregar, quitar o recolorear): añade o edita una entrada aquí.
 * Los `icono` son íconos de Iconify de `@iconify-json/simple-icons` (ya instalado); el `id` es lo que se
 * guarda en el servidor (`^[a-z0-9][a-z0-9-]{0,29}$`), así que no lo cambies en una entrada existente:
 * quien ya la eligió dejaría de verla. Un id que ya no esté aquí simplemente se ignora al mostrarlo. */
export interface Tecnologia {
  /** Clave estable (se guarda en el servidor y es la key de Vue). */
  id: string
  nombre: string
  /** Índice de Iconify, p. ej. `simple-icons:vite`. */
  icono: string
  /** Color de marca: pinta el chip y el acento de la credencial. */
  color: string
  grupo: GrupoTecnologia
}

export type GrupoTecnologia = 'frontend' | 'lenguajes' | 'backend' | 'infra' | 'movil' | 'ia' | 'otros'

/** Cuántas tecnologías puede elegir una persona (el backend también lo exige). */
export const MAXIMO_TECNOLOGIAS = 8

export const GRUPOS_TECNOLOGIA: ReadonlyArray<{ id: GrupoTecnologia, nombre: string }> = [
  { id: 'frontend', nombre: 'Frontend' },
  { id: 'lenguajes', nombre: 'Lenguajes' },
  { id: 'backend', nombre: 'Backend y datos' },
  { id: 'infra', nombre: 'Herramientas y nube' },
  { id: 'movil', nombre: 'Móvil' },
  { id: 'ia', nombre: 'Inteligencia artificial' },
  { id: 'otros', nombre: 'Diseño, juegos y hardware' },
]

export const TECNOLOGIAS: Tecnologia[] = [
  // Frontend
  { id: 'vite', nombre: 'Vite', icono: 'simple-icons:vite', color: '#646CFF', grupo: 'frontend' },
  { id: 'vue', nombre: 'Vue', icono: 'simple-icons:vuedotjs', color: '#42B883', grupo: 'frontend' },
  { id: 'nuxt', nombre: 'Nuxt', icono: 'simple-icons:nuxt', color: '#00DC82', grupo: 'frontend' },
  { id: 'react', nombre: 'React', icono: 'simple-icons:react', color: '#61DAFB', grupo: 'frontend' },
  { id: 'nextjs', nombre: 'Next.js', icono: 'simple-icons:nextdotjs', color: '#EDEDED', grupo: 'frontend' },
  { id: 'angular', nombre: 'Angular', icono: 'simple-icons:angular', color: '#DD0031', grupo: 'frontend' },
  { id: 'svelte', nombre: 'Svelte', icono: 'simple-icons:svelte', color: '#FF3E00', grupo: 'frontend' },
  { id: 'astro', nombre: 'Astro', icono: 'simple-icons:astro', color: '#BC52EE', grupo: 'frontend' },
  { id: 'tailwind', nombre: 'Tailwind CSS', icono: 'simple-icons:tailwindcss', color: '#06B6D4', grupo: 'frontend' },
  { id: 'html', nombre: 'HTML', icono: 'simple-icons:html5', color: '#E34F26', grupo: 'frontend' },
  { id: 'css', nombre: 'CSS', icono: 'simple-icons:css3', color: '#1572B6', grupo: 'frontend' },

  // Lenguajes
  { id: 'typescript', nombre: 'TypeScript', icono: 'simple-icons:typescript', color: '#3178C6', grupo: 'lenguajes' },
  { id: 'javascript', nombre: 'JavaScript', icono: 'simple-icons:javascript', color: '#F7DF1E', grupo: 'lenguajes' },
  { id: 'python', nombre: 'Python', icono: 'simple-icons:python', color: '#3776AB', grupo: 'lenguajes' },
  { id: 'java', nombre: 'Java', icono: 'simple-icons:openjdk', color: '#ED8B00', grupo: 'lenguajes' },
  { id: 'php', nombre: 'PHP', icono: 'simple-icons:php', color: '#777BB4', grupo: 'lenguajes' },
  { id: 'csharp', nombre: 'C#', icono: 'simple-icons:csharp', color: '#9B4F96', grupo: 'lenguajes' },
  { id: 'cpp', nombre: 'C++', icono: 'simple-icons:cplusplus', color: '#00599C', grupo: 'lenguajes' },
  { id: 'go', nombre: 'Go', icono: 'simple-icons:go', color: '#00ADD8', grupo: 'lenguajes' },
  { id: 'rust', nombre: 'Rust', icono: 'simple-icons:rust', color: '#DEA584', grupo: 'lenguajes' },
  { id: 'kotlin', nombre: 'Kotlin', icono: 'simple-icons:kotlin', color: '#7F52FF', grupo: 'lenguajes' },
  { id: 'swift', nombre: 'Swift', icono: 'simple-icons:swift', color: '#F05138', grupo: 'lenguajes' },
  { id: 'dart', nombre: 'Dart', icono: 'simple-icons:dart', color: '#0175C2', grupo: 'lenguajes' },

  // Backend y datos
  { id: 'nodejs', nombre: 'Node.js', icono: 'simple-icons:nodedotjs', color: '#5FA04E', grupo: 'backend' },
  { id: 'express', nombre: 'Express', icono: 'simple-icons:express', color: '#E5E5E5', grupo: 'backend' },
  { id: 'nestjs', nombre: 'NestJS', icono: 'simple-icons:nestjs', color: '#E0234E', grupo: 'backend' },
  { id: 'laravel', nombre: 'Laravel', icono: 'simple-icons:laravel', color: '#FF2D20', grupo: 'backend' },
  { id: 'django', nombre: 'Django', icono: 'simple-icons:django', color: '#44B78B', grupo: 'backend' },
  { id: 'spring', nombre: 'Spring', icono: 'simple-icons:spring', color: '#6DB33F', grupo: 'backend' },
  { id: 'prisma', nombre: 'Prisma', icono: 'simple-icons:prisma', color: '#5A67D8', grupo: 'backend' },
  { id: 'mysql', nombre: 'MySQL', icono: 'simple-icons:mysql', color: '#4479A1', grupo: 'backend' },
  { id: 'postgresql', nombre: 'PostgreSQL', icono: 'simple-icons:postgresql', color: '#4169E1', grupo: 'backend' },
  { id: 'mongodb', nombre: 'MongoDB', icono: 'simple-icons:mongodb', color: '#47A248', grupo: 'backend' },
  { id: 'redis', nombre: 'Redis', icono: 'simple-icons:redis', color: '#FF4438', grupo: 'backend' },
  { id: 'firebase', nombre: 'Firebase', icono: 'simple-icons:firebase', color: '#FFCA28', grupo: 'backend' },
  { id: 'supabase', nombre: 'Supabase', icono: 'simple-icons:supabase', color: '#3ECF8E', grupo: 'backend' },

  // Herramientas y nube
  { id: 'github', nombre: 'GitHub', icono: 'simple-icons:github', color: '#F0F6FC', grupo: 'infra' },
  { id: 'git', nombre: 'Git', icono: 'simple-icons:git', color: '#F05032', grupo: 'infra' },
  { id: 'gitlab', nombre: 'GitLab', icono: 'simple-icons:gitlab', color: '#FC6D26', grupo: 'infra' },
  { id: 'docker', nombre: 'Docker', icono: 'simple-icons:docker', color: '#2496ED', grupo: 'infra' },
  { id: 'kubernetes', nombre: 'Kubernetes', icono: 'simple-icons:kubernetes', color: '#326CE5', grupo: 'infra' },
  { id: 'linux', nombre: 'Linux', icono: 'simple-icons:linux', color: '#FCC624', grupo: 'infra' },
  { id: 'vercel', nombre: 'Vercel', icono: 'simple-icons:vercel', color: '#F5F5F5', grupo: 'infra' },
  { id: 'cloudflare', nombre: 'Cloudflare', icono: 'simple-icons:cloudflare', color: '#F38020', grupo: 'infra' },

  // Móvil
  { id: 'flutter', nombre: 'Flutter', icono: 'simple-icons:flutter', color: '#02569B', grupo: 'movil' },
  { id: 'android', nombre: 'Android', icono: 'simple-icons:android', color: '#3DDC84', grupo: 'movil' },

  // Inteligencia artificial
  { id: 'chatgpt', nombre: 'ChatGPT', icono: 'simple-icons:openai', color: '#10A37F', grupo: 'ia' },
  { id: 'claude', nombre: 'Claude', icono: 'simple-icons:anthropic', color: '#D97757', grupo: 'ia' },
  { id: 'gemini', nombre: 'Gemini', icono: 'simple-icons:googlegemini', color: '#8E75B2', grupo: 'ia' },
  { id: 'copilot', nombre: 'Copilot', icono: 'simple-icons:githubcopilot', color: '#6E7BFF', grupo: 'ia' },
  { id: 'ollama', nombre: 'Ollama', icono: 'simple-icons:ollama', color: '#E8E8E8', grupo: 'ia' },

  // Diseño, juegos y hardware
  { id: 'figma', nombre: 'Figma', icono: 'simple-icons:figma', color: '#F24E1E', grupo: 'otros' },
  { id: 'unity', nombre: 'Unity', icono: 'simple-icons:unity', color: '#E6E6E6', grupo: 'otros' },
  { id: 'godot', nombre: 'Godot', icono: 'simple-icons:godotengine', color: '#478CBF', grupo: 'otros' },
  { id: 'arduino', nombre: 'Arduino', icono: 'simple-icons:arduino', color: '#00979D', grupo: 'otros' },
  { id: 'raspberrypi', nombre: 'Raspberry Pi', icono: 'simple-icons:raspberrypi', color: '#C51A4A', grupo: 'otros' },
]

export function tecnologiaPorId(id: string): Tecnologia | undefined {
  return TECNOLOGIAS.find(tech => tech.id === id)
}

/** Texto legible sobre un chip del color de marca (negro o blanco). */
export function textoSobreColor(color: string): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  // Luminancia relativa simplificada (ITU-R BT.709).
  const luminancia = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminancia > 0.6 ? '#0b1220' : '#ffffff'
}
