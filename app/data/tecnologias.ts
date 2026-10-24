/** Catálogo de tecnologías de la credencial vertical.
 *
 * Para «administrar» las tecnologías (agregar, quitar o recolorear):
 * añade o edita una entrada aquí y sube el logo si usas uno propio.
 * Los `icono` son colecciones de Iconify empaquetadas en el proyecto
 * (`@iconify-json/simple-icons`); también puedes apuntar a un SVG de
 * `public/images/` con la misma sintaxis que usa Nuxt Icon. */
export interface Tecnologia {
  /** Clave estable (se usa para seleccionar y como key de Vue). */
  id: string;
  nombre: string;
  /** Índice de Iconify, p. ej. `simple-icons:vite`. */
  icono: string;
  /** Color de marca: pinta el chip y el acento de la credencial. */
  color: string;
}

export const TECNOLOGIAS: Tecnologia[] = [
  { id: "vite", nombre: "Vite", icono: "simple-icons:vite", color: "#646CFF" },
  { id: "vue", nombre: "Vue", icono: "simple-icons:vuedotjs", color: "#42B883" },
  { id: "nuxt", nombre: "Nuxt", icono: "simple-icons:nuxt", color: "#00DC82" },
  {
    id: "typescript",
    nombre: "TypeScript",
    icono: "simple-icons:typescript",
    color: "#3178C6",
  },
  {
    id: "chatgpt",
    nombre: "ChatGPT",
    icono: "simple-icons:openai",
    color: "#10A37F",
  },
  {
    id: "claude",
    nombre: "Claude",
    icono: "simple-icons:anthropic",
    color: "#D97757",
  },
  { id: "github", nombre: "GitHub", icono: "simple-icons:github", color: "#F0F6FC" },
  {
    id: "tailwind",
    nombre: "Tailwind CSS",
    icono: "simple-icons:tailwindcss",
    color: "#06B6D4",
  },
  { id: "react", nombre: "React", icono: "simple-icons:react", color: "#61DAFB" },
  { id: "figma", nombre: "Figma", icono: "simple-icons:figma", color: "#F24E1E" },
];

export function tecnologiaPorId(id: string): Tecnologia | undefined {
  return TECNOLOGIAS.find((tech) => tech.id === id);
}

/** Texto legible sobre un chip del color de marca (negro o blanco). */
export function textoSobreColor(color: string): string {
  const hex = color.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Luminancia relativa simplificada (ITU-R BT.709).
  const luminancia = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminancia > 0.6 ? "#0b1220" : "#ffffff";
}
