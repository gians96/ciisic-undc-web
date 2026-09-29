# Implementation Plan: Landing conectada a la API multi-evento

**Branch**: `feat/multi-evento-sdd` | **Date**: 2026-09-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-landing-multi-evento/spec.md`

## Summary

La landing deja las rutas legacy y el proxy de DNI con token, y pasa a consumir la API pública
multi-evento de `backend-ciisic` a partir de un código de evento configurable: evento (estado de
inscripciones, contacto, datos de pago), tipos de inscripción por categoría, consulta de DNI,
verificación de estudiante UNDC, envío multipart de inscripciones, papers y contacto. La lógica de
decisión del cliente se aísla en funciones puras con pruebas; las páginas conservan su diseño.

## Technical Context

**Language/Version**: TypeScript 5.9, Vue 3.5, Nuxt 4.5 (SSR, directorio `app/`)

**Primary Dependencies**: Pinia 3, `@nuxtjs/tailwindcss` 6 (Tailwind v3), `@nuxt/icon`, `$fetch` (ofetch)

**Storage**: N/A (la confirmación usa el store Pinia en memoria)

**Testing**: Vitest 5 + happy-dom (`tests/**/*.test.ts`)

**Target Platform**: Node 22 (imagen Docker) y navegadores modernos

**Project Type**: aplicación web (frontend SSR que consume `backend-ciisic`)

**Performance Goals**: sin peticiones duplicadas entre SSR e hidratación; navegación cliente entre
páginas de inscripción sin volver a pedir evento ni planes.

**Constraints**: límites por IP del backend (lectura 120/min, DNI 10/min, verificación 20/min,
inscripciones 10/15 min, papers 10/15 min, contacto 5/15 min); voucher ≤ 5 MB.

**Scale/Scope**: 6 páginas afectadas (`/planes`, `/estudiantes`, `/general`, `/confirmation`,
`/contacto`, `/login`) y el formulario de papers.

## Constitution Check

*GATE: revisado antes de implementar y al cerrar.*

| Principio | Estado | Cómo se cumple |
|---|---|---|
| I. Contrato del backend | ✅ | Se referencian los contratos 002/003/004; montos, descuentos y estado los decide el servidor; todo sale de `NUXT_PUBLIC_EVENTO_CODIGO`; sin rutas legacy. |
| II. Sin secretos | ✅ | Se eliminan `xApiToken`, `xApiUrl`, `backendBaseUrl`, el proxy de DNI y el BFF de autenticación. |
| III. Stack y diseño | ✅ | Sin cambios de dependencias; se reutilizan tarjetas y estilos existentes; marketing intacto. |
| IV. Accesibilidad | ✅ | Chip de verificación con `aria-live`, notificaciones con `role="alert"`/`status`, tarjetas de plan operables con teclado. |
| V. Calidad | ✅ | Helpers puros en `app/utils/` con pruebas; puertas lint/typecheck/test/build. |

## Decisiones

- **D1 — Lógica compartida en un composable.** `estudiantes.vue` y `general.vue` eran ~95 %
  iguales. La lógica pasa a `useFormularioInscripcion({ categoria, verificarEstudiante })` y cada
  página conserva su template y sus estilos (diseño intacto, diff de template acotado).
- **D2 — Datos del evento con `useAsyncData`.** Claves `evento:<codigo>` y
  `planes:<codigo>:<categoria>`; `getCachedData` reutiliza el payload (hidratación y navegación
  cliente) salvo en un refresco manual ("Reintentar").
- **D3 — Precio mostrado = réplica de `calcularPrecio` del backend.** Estudiantil → verificación;
  general → dominio institucional del evento. Es solo informativo: el servidor calcula el monto.
- **D4 — Verificación de estudiante.** Debounce de 600 ms, `AbortController` y número de
  secuencia para descartar respuestas obsoletas; el token se usa solo si
  `esEstudianteUndc === true` y viene `verificacionToken`. Con CE no se llama (el backend
  respondería `DOCUMENTO_NO_SOPORTADO`) y se muestra ese aviso localmente.
- **D5 — Fecha de pago.** Se envía el valor del `<input type="date">` (`YYYY-MM-DD`) validado,
  sin pasar por `Date`/UTC. El `max` (hoy en Lima) se calcula en el cliente al montar para no
  generar desajustes de hidratación.
- **D6 — Título del plan.** `nombre` + `etiqueta` cuando el nombre no la contiene (conserva
  "ESTUDIANTES CON KIT"; "… EN GENERAL CON KIT" no se duplica).
- **D7 — Carné de extranjería.** 9–12 caracteres alfanuméricos según el contrato; sin consulta.
- **D8 — Medios de pago dinámicos.** Una opción por banco y por billetera de `datosPago` (hoy
  BCP y Yape, con el mismo aspecto que antes). URLs de QR aceptadas solo si son relativas o http(s).
- **D9 — `/login`.** `navigateTo(adminUrl, { external: true })`: 302 en SSR y redirección en
  navegación cliente. Se eliminan las rutas de autenticación de Nitro que ya no se usan.
- **D10 — Clasificación.** Se mantienen las opciones fijas de ciclos I–X (ids del catálogo del
  backend); el contrato público no expone clasificaciones por evento.
- **D11 — Confirmación en memoria.** No hay GET público de inscripciones; se mantiene el store.
- **D12 — Errores de red.** `normalizeApiError` distingue `NETWORK_ERROR` (sin respuesta) de
  errores del servidor para dar un mensaje accionable.

## Archivos

| Archivo | Cambio |
|---|---|
| `nuxt.config.ts`, `.env.example` | `eventoCodigo`, `adminUrl`; se retiran `xApiToken`, `xApiUrl`, `backendBaseUrl`. |
| `app/types/evento.ts` (nuevo), `app/types/inscription.ts`, `app/types/index.ts` | Tipos del contrato; se retiran los de la API de DNI anterior. |
| `app/utils/api-publica.ts` (nuevo) | Rutas de la API pública. |
| `app/utils/planes.ts` (nuevo) | Mapeo de categorías/tipos a tarjetas, título y regla de precio. |
| `app/utils/inscripcion.ts` (nuevo) | Formulario → datos del contrato, `FormData`, fecha de pago, celular, voucher. |
| `app/utils/errores-api.ts` (nuevo) | `code` → mensaje (inscripción, consulta DNI, genéricos). |
| `app/utils/verificacion.ts` (nuevo) | Mensajes por `motivo` y condiciones de verificación. |
| `app/utils/formato.ts` (nuevo) | Soles, fechas sin corrimiento, WhatsApp, URL segura. |
| `app/composables/useEvento.ts`, `usePlanes.ts`, `useVerificacionEstudiante.ts`, `useFormularioInscripcion.ts` (nuevos) | Carga de datos y lógica de formulario. |
| `app/composables/useApi.ts`, `useConsultation.ts`, `useInscription.ts` | Error de red; DNI al backend; envío multipart. |
| `app/components/EstadoInscripciones.vue` (nuevo) | Estados cargando / error / inscripciones cerradas. |
| `app/components/NotificationSystem.vue` | `role="alert"` / `role="status"`. |
| `app/pages/estudiantes.vue`, `general.vue` | Template conectado al composable; chip de verificación (estudiantes). |
| `app/pages/planes.vue`, `confirmation.vue`, `contacto.vue`, `login.vue` | Estado cerrado; respuesta nueva; endpoint del evento; redirección al panel. |
| `app/components/PaperSubmissionForm.vue` | Endpoint del evento. |
| `app/stores/inscription.ts` | Tipado con la respuesta nueva. |
| Eliminados | `app/config/payment.ts`, `app/stores/inscriptionPlans.ts`, `server/api/consultation.post.ts`, `server/api/auth/*`, `server/utils/backend.ts`. |
| `tests/*.test.ts` | Pruebas de los helpers nuevos. |
| `.github/workflows/ci.yml`, `docs/*.md` | Variables y flujo actualizados. |

## Riesgos y pendientes

- **Límite de lectura compartido en SSR**: las peticiones SSR salen desde la IP del servidor de la
  landing y comparten el límite de 120/min del backend. Con tráfico alto conviene excluir esa IP
  en el backend o agregar una micro-caché en Nitro.
- **Verificación en producción**: depende de la API key de API_UNDC en el backend; sin ella todos
  los estudiantes pagan precio regular (comportamiento esperado y comunicado en el chip).
- **`/undc`** conserva precios propios hardcodeados (fuera de alcance).

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-multi-evento/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── components/   EstadoInscripciones.vue, NotificationSystem.vue, PaperSubmissionForm.vue
├── composables/  useApi, useEvento, usePlanes, useConsultation, useVerificacionEstudiante,
│                 useInscription, useFormularioInscripcion
├── pages/        planes, estudiantes, general, confirmation, contacto, login
├── stores/       inscription.ts
├── types/        evento.ts, inscription.ts, index.ts
└── utils/        api-publica, planes, inscripcion, errores-api, verificacion, formato
tests/            *.test.ts (Vitest)
```

**Structure Decision**: proyecto Nuxt único existente; no se agregan paquetes ni rutas de servidor.
