# Constitución de ciisic-undc-web

Landing pública del CIISIC (UNDC): contenido del congreso e inscripciones. Nuxt 4 (directorio
`app/`) con SSR, Pinia y `@nuxtjs/tailwindcss`. Consume la API del sitio de `backend-ciisic` a
través de su propio servidor Nitro.

## Principios

### I. El contrato de la API pertenece a backend-ciisic

- La landing consume la **API del sitio** de `backend-ciisic` (`/api/v1/site/**`). Sus contratos
  (`backend-ciisic/specs/*/contracts/`) son la fuente de verdad: las specs de este repositorio los
  referencian, no los copian ni los redefinen. Este repositorio solo es dueño del contrato de sus
  rutas BFF (`server/api/publico/*`).
- Precios, descuentos, estados y reglas de negocio los decide el servidor. El cliente solo muestra
  y valida para guiar al usuario; nunca envía montos, descuentos ni estados.
- Lo que cambia entre ediciones (evento, tipos de inscripción, precios, datos de pago, contacto,
  catálogos) se lee de la API; el evento lo determina el token configurado, no el código.
- El código nuevo no usa rutas legacy (`/api/v1/inscription`, `/api/v1/registration-types`,
  `/api/v1/public/**`, `/api/v1/classification`, …).

*Razón*: el backend atiende varios eventos y es quien valida; duplicar reglas en el cliente
produce precios o mensajes que no coinciden con lo que se registra.

### II. El token del evento vive solo en el servidor (BFF)

- La landing actúa como BFF: el navegador solo llama a rutas Nitro del mismo origen
  (`server/api/publico/*`), que agregan `X-Api-Key` (token del evento) y `X-Client-Ip` (IP del
  visitante) y reenvían a `backend-ciisic`. Ninguna llamada del navegador va directo al backend.
- El token (`NUXT_BACKEND_EVENT_TOKEN`) y la dirección del backend (`NUXT_BACKEND_BASE_URL`) son
  configuración privada que se define en runtime: nunca en `runtimeConfig.public`, en el bundle del
  cliente, en la imagen de build, en respuestas ni en logs. Son las únicas variables de entorno de
  la landing.
- Lo que el navegador necesita de las integraciones (client ID de Google, URL del panel) no es
  configuración de la landing: se lee en runtime de la API del sitio (`GET /api/publico/configuracion`,
  backend `GET /config`). No hay variables `NUXT_PUBLIC_*` para URLs ni identificadores.
- Scripts de terceros en el navegador, solo los imprescindibles y solo en el cliente: Google Identity
  Services se carga bajo demanda en los formularios de inscripción. La credencial que entrega (ID
  token) se envía al BFF y no se guarda; el token de verificación que devuelve el backend vive solo
  en memoria.
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
  estudiante, verificación del correo con Google) el usuario puede continuar (ingreso manual,
  precio regular, correo escrito a mano).

### V. Calidad verificable

- La lógica que decide algo (mapeos, validaciones, armado de payloads, mensajes, encabezados e IP
  del BFF) vive en funciones puras de `app/utils/` y `server/utils/` con pruebas unitarias en
  Vitest (`tests/`), usando `fetch` simulado para el BFF.
- Puertas obligatorias antes de integrar: `bun run lint` (0 errores), `bun run typecheck`,
  `bun run test` y `bun run build`.
- Todo cambio de comportamiento se especifica primero en `specs/NNN-nombre/` (spec → plan →
  tareas) siguiendo Spec Kit.

## Restricciones técnicas

- SSR activo: los datos compartidos se cargan con `useAsyncData` y clave estable (sin desajustes
  de hidratación ni peticiones duplicadas entre servidor y cliente).
- Lecturas (evento, tipos de inscripción, catálogos, configuración del sitio): rutas Nitro con caché
  (`defineCachedEventHandler`, 60 s; catálogos 10 min) y claves constantes o en lista blanca; los
  errores no se cachean.
- Acciones del visitante (consulta de DNI, verificación de estudiante, verificación con Google,
  inscripción, ponencias, contacto): sin caché y con la IP del visitante (última de
  `X-Forwarded-For`, que agrega Traefik, o la del socket; validada con `net.isIP`) para que el
  backend aplique su límite por visitante.
- El BFF propaga sin cambios el estado HTTP y el cuerpo de error del backend, limita el cuerpo
  recibido (multipart: 5 MB + margen → `413`; JSON: 100 KB) y responde `503 SITE_NOT_CONFIGURED`
  si falta el token o la dirección del backend.
- En el cliente, las llamadas pasan por `useApi()` (mismo origen, timeout explícito, errores
  normalizados `{ statusCode, code, message, fields }`).
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

**Versión**: 2.1.0 | **Ratificada**: 2026-09-29 | **Última enmienda**: 2026-09-29

*2.1.0*: la configuración que necesita el navegador (client ID de Google, URL del panel) se lee de
la API del sitio en lugar de variables `NUXT_PUBLIC_*`; regla para scripts de terceros (Google
Identity Services) y la verificación con Google como acción del visitante.
