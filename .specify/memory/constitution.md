# Constitución de ciisic-undc-web

Landing pública del CIISIC (UNDC): contenido del congreso e inscripciones. Nuxt 4 (directorio
`app/`) con SSR, Pinia y `@nuxtjs/tailwindcss`. Consume la API de `backend-ciisic`.

## Principios

### I. El contrato de la API pertenece a backend-ciisic

- La landing consume la API pública `/api/v1/public/**`. Los contratos de
  `backend-ciisic/specs/*/contracts/` son la fuente de verdad: las specs de este repositorio los
  referencian, no los copian ni los redefinen.
- Precios, descuentos, estados y reglas de negocio los decide el servidor. El cliente solo muestra
  y valida para guiar al usuario; nunca envía montos, descuentos ni estados.
- Lo que cambia entre ediciones (evento, tipos de inscripción, precios, datos de pago, contacto)
  se lee de la API a partir de `NUXT_PUBLIC_EVENTO_CODIGO`; no se hardcodea en páginas.
- El código nuevo no usa las rutas legacy (`/api/v1/inscription`, `/api/v1/registration-types`, …).

*Razón*: el backend atiende varios eventos y es quien valida; duplicar reglas en el cliente
produce precios o mensajes que no coinciden con lo que se registra.

### II. Sin secretos en el cliente ni en el repositorio

- La configuración pública (`runtimeConfig.public`) contiene la URL de la API, el código del
  evento y la URL del panel. La configuración privada de Nitro se limita a direcciones internas
  (`backendBaseUrl`), nunca tokens. Los tokens de proveedores (consulta DNI, API_UNDC, correo)
  viven en el backend.
- No se crean proxys en `server/` para esconder tokens: si algo requiere un secreto, pertenece al
  backend.
- `.env` no se versiona; `.env.example` documenta cada variable sin valores reales.

### III. Stack y diseño visual estables

- Se mantiene Nuxt 4 con `@nuxtjs/tailwindcss` (Tailwind v3) de forma intencional: no se migra a
  Tailwind v4 ni se cambia la identidad visual como efecto colateral de una feature.
- El contenido de marketing (hero, cronograma, ponentes, sede, memorias…) solo se modifica cuando
  la feature lo pide de forma explícita.
- Gestor de paquetes: **bun** (`bun.lock`, `bun install --frozen-lockfile`). `package-lock.json`
  es un residuo y no se actualiza.

### IV. Accesibilidad y experiencia básicas

- Controles con `label` asociado, foco visible, elementos interactivos operables con teclado y
  mensajes dinámicos anunciados (`role="alert"` / `aria-live`).
- Interfaz en español; los errores dicen qué pasó y qué hacer, nunca muestran códigos técnicos.
- Degradación elegante: si un servicio auxiliar falla (consulta de DNI, verificación de
  estudiante) el usuario puede continuar (ingreso manual, precio regular).

### V. Calidad verificable

- La lógica del cliente que decide algo (mapeos, validaciones, armado de payloads, mensajes) vive
  en funciones puras de `app/utils/` con pruebas unitarias en Vitest (`tests/`).
- Puertas obligatorias antes de integrar: `bun run lint` (0 errores), `bun run typecheck`,
  `bun run test` y `bun run build`.
- Todo cambio de comportamiento se especifica primero en `specs/NNN-nombre/` (spec → plan →
  tareas) siguiendo Spec Kit.

## Restricciones técnicas

- SSR activo: los datos compartidos se cargan con `useAsyncData` y clave estable (sin desajustes
  de hidratación ni peticiones duplicadas entre servidor y cliente).
- Las lecturas públicas que se renderizan en SSR (evento y tipos de inscripción) pasan por rutas
  Nitro con caché corta (`server/api/publico/*`, 60 s, claves por código de evento y categoría
  en lista blanca) para no concentrar en la IP del servidor el límite de lectura del backend.
- Las acciones del visitante (consulta de DNI, verificación, inscripción, papers, contacto) van
  directo del navegador a la API con `useApi()` (base `NUXT_PUBLIC_API_BASE_URL`, timeout
  explícito, errores normalizados `{ statusCode, code, message, fields }`), para que cada
  visitante tenga su propio límite por IP.
- La validación de archivos en el cliente (tipo y tamaño) es solo una ayuda; la validación por
  contenido la hace el backend.

## Flujo de trabajo

- Ramas de feature; commits convencionales en español, agregando archivos de forma explícita.
- Cada PR verifica el cumplimiento de esta constitución; las excepciones se justifican en el
  `plan.md` de la feature.

## Gobernanza

Esta constitución prevalece sobre prácticas ad hoc. Se modifica mediante PR que actualice este
archivo con versionado semántico: MAJOR al eliminar o redefinir un principio, MINOR al agregar un
principio o sección, PATCH para aclaraciones de redacción.

**Versión**: 1.1.0 | **Ratificada**: 2026-09-29 | **Última enmienda**: 2026-09-29
