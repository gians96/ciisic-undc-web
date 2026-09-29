# Implementation Plan: Landing conectada a la API multi-evento

**Branch**: `feat/multi-evento-sdd` | **Date**: 2026-09-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-landing-multi-evento/spec.md`

## Summary

La landing deja las rutas legacy y el proxy de DNI con token de proveedor, y pasa a consumir la
**API del sitio** de `backend-ciisic` (`/api/v1/site`) a través de su propio servidor Nitro, que
actúa como BFF con el token de acceso del evento: evento (estado de inscripciones, contacto, datos
de pago), tipos de inscripción, catálogos, consulta de DNI, verificación de estudiante UNDC, envío
multipart de inscripciones, ponencias y contacto. La lógica de decisión (cliente y BFF) se aísla
en funciones puras con pruebas; las páginas conservan su diseño.

## Technical Context

**Language/Version**: TypeScript 5.9, Vue 3.5, Nuxt 4.5 (SSR, directorio `app/`), Nitro 2 / h3 1

**Primary Dependencies**: Pinia 3, `@nuxtjs/tailwindcss` 6 (Tailwind v3), `@nuxt/icon`, `$fetch` (ofetch)

**Storage**: caché en memoria de Nitro para lecturas; la confirmación usa el store Pinia en memoria

**Testing**: Vitest 5 (happy-dom para `app/`, entorno node para el BFF) con `fetch` simulado

**Target Platform**: Node 22 (imagen Docker detrás de Traefik en Dokploy) y navegadores modernos

**Project Type**: aplicación web (frontend SSR + BFF que consume `backend-ciisic`)

**Performance Goals**: sin peticiones duplicadas entre SSR e hidratación; lecturas del backend
acotadas por la caché de Nitro, sin importar el tráfico.

**Constraints**: el backend exige `X-Api-Key` y no lo acepta desde navegadores (CORS); límites por
visitante vía `X-Client-Ip` (DNI 10/min, verificación 20/min, inscripciones 10/15 min, papers
10/15 min, contacto 5/15 min); voucher y PDF ≤ 5 MB.

**Scale/Scope**: 7 páginas (`/planes`, `/estudiantes`, `/general`, `/confirmation`, `/contacto`,
`/login`, `/undc`), el formulario de papers y 8 rutas BFF.

## Constitution Check

*GATE: revisado antes de implementar y al cerrar.*

| Principio | Estado | Cómo se cumple |
|---|---|---|
| I. Contrato del backend | ✅ | Se referencian los contratos del backend; el BFF (`contracts/bff-landing.md`) es el único contrato propio; montos, descuentos y estado los decide el servidor; sin rutas legacy. |
| II. Token solo en el servidor | ✅ | `backendEventToken` y `backendBaseUrl` solo en runtimeConfig privado y sin valor en el build; el navegador solo llama a `/api/publico/*`; el token no se devuelve ni se registra. |
| III. Stack y diseño | ✅ | Sin dependencias nuevas; se reutilizan tarjetas y estilos existentes; marketing intacto. |
| IV. Accesibilidad | ✅ | Chip de verificación con `aria-live`, notificaciones con `role="alert"`/`status`, tarjetas de plan operables con teclado. |
| V. Calidad | ✅ | Helpers puros en `app/utils/` y `server/utils/` con pruebas (BFF con `fetch` simulado); puertas lint/typecheck/test/build. |

## Decisiones

- **D1 — Lógica compartida en un composable.** `estudiantes.vue` y `general.vue` eran ~95 %
  iguales. La lógica pasa a `useFormularioInscripcion({ categoria, verificarEstudiante })` y cada
  página conserva su template y sus estilos (diseño intacto, diff de template acotado).
- **D2 — Datos del evento con `useAsyncData`.** Claves constantes `evento`, `planes:<categoria>` y
  `catalogos` (el evento lo define el token); `getCachedData` reutiliza el payload (hidratación y
  navegación cliente) salvo en un refresco manual ("Reintentar").
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
- **D10 — Clasificaciones desde `/catalogs`.** Las opciones de ciclo salen del catálogo del
  backend (vía `/api/publico/catalogos`), mostradas sin el prefijo "ESTUDIANTE - " para conservar
  el aspecto actual. Los tipos de documento mantienen las reglas locales (reflejan la validación
  del backend: DNI 8 dígitos, CE 9–12).
- **D11 — Confirmación en memoria.** No hay GET público de inscripciones; se mantiene el store.
- **D12 — Errores de red y del BFF.** `normalizeApiError` distingue `NETWORK_ERROR` (sin
  respuesta); `SITE_NOT_CONFIGURED`, `EVENT_TOKEN_REQUIRED`, `INVALID_EVENT_TOKEN` y
  `BACKEND_UNAVAILABLE` se muestran como "servicio no disponible" sin detalles técnicos.
- **D13 — BFF con token del evento (decisión del usuario).** El backend exige `X-Api-Key` y no lo
  admite desde navegadores, así que todas las llamadas pasan por `server/api/publico/*`. Las
  lecturas usan `defineCachedEventHandler` (evento y planes 60 s, catálogos 10 min,
  stale-while-revalidate) con claves constantes o en lista blanca; Nitro no guarda respuestas
  `>= 400`. Las acciones se reenvían sin caché.
- **D14 — `/undc` redirige a `/planes`** (301) para retirar precios fijos sin romper enlaces.
- **D15 — Núcleo del BFF puro y probado.** `server/utils/api-sitio.ts` no usa globals de Nitro:
  arma encabezados (`X-Api-Key`, `X-Client-Ip`, `Accept`, `Content-Type`), llama a un `fetch`
  inyectado con `ignoreResponseError`, devuelve `{ status, cuerpo }` del backend sin cambios y
  genera los errores propios (`SITE_NOT_CONFIGURED`, `BACKEND_UNAVAILABLE`). La capa h3
  (`server/utils/sitio.ts`) solo lee config, IP y cuerpo, y fija el estado HTTP.
- **D16 — IP del visitante.** Última entrada de `X-Forwarded-For` (Traefik la agrega al final) o
  la del socket, validada con `net.isIP`; `::ffff:a.b.c.d` se normaliza a IPv4. Se envía solo si
  es válida. En lecturas cacheadas es irrelevante (una lectura por minuto).
- **D17 — Reenvío del cuerpo tal cual.** Multipart y JSON se leen como bytes con límite
  (`Content-Length` declarado o bytes leídos; multipart 5 MB + 512 KB de margen para campos y
  separadores, JSON 100 KB → `413`) y se reenvían con el mismo `Content-Type` (incluido el
  `boundary`). El backend sigue validando el archivo (5 MB exactos, contenido).
- **D18 — Configuración sin secretos en el build.** `backendEventToken` y `backendBaseUrl` se
  declaran vacíos en `nuxt.config.ts` y se completan en runtime con `NUXT_BACKEND_EVENT_TOKEN` y
  `NUXT_BACKEND_BASE_URL`; se retiran `NUXT_PUBLIC_API_BASE_URL` y `NUXT_PUBLIC_EVENTO_CODIGO`.

## Archivos

| Archivo | Cambio |
|---|---|
| `nuxt.config.ts`, `.env.example` | `backendEventToken` y `backendBaseUrl` privados (runtime); `adminUrl` público; se retiran `apiBaseUrl`, `eventoCodigo`, `xApiToken`, `xApiUrl`. |
| `server/utils/api-sitio.ts` (nuevo) | Núcleo puro del BFF: encabezados, IP, llamada, errores propios, lectura con límite. |
| `server/utils/sitio.ts` (nuevo) | Capa h3: config, IP, reenvío de cuerpo y estado HTTP. |
| `server/api/publico/{evento,planes,catalogos}.get.ts` | Lecturas cacheadas. |
| `server/api/publico/consulta-dni/[numero].get.ts`, `{verificacion-estudiante,inscripciones,ponencias,contacto}.post.ts` (nuevos) | Acciones sin caché. |
| `app/utils/rutas-sitio.ts` (reemplaza `api-publica.ts`) | Rutas del BFF (mismo origen). |
| `app/types/evento.ts`, `app/types/inscription.ts`, `app/types/index.ts` | Tipos del contrato (incluye catálogos). |
| `app/utils/planes.ts`, `inscripcion.ts`, `errores-api.ts`, `verificacion.ts`, `formato.ts`, `consulta-dni.ts`, `catalogos.ts` | Helpers puros del cliente. |
| `app/composables/useApi.ts` | Mismo origen, sin `apiBaseUrl`. |
| `app/composables/useEvento.ts`, `usePlanes.ts`, `useCatalogos.ts`, `useConsultation.ts`, `useVerificacionEstudiante.ts`, `useInscription.ts`, `useFormularioInscripcion.ts` | Datos y formularios contra el BFF. |
| `app/components/EstadoInscripciones.vue` (nuevo), `NotificationSystem.vue` | Estados cargando / error / cerradas; roles ARIA. |
| `app/pages/estudiantes.vue`, `general.vue`, `planes.vue`, `confirmation.vue`, `contacto.vue`, `login.vue`, `undc.vue` | Formularios conectados; estado cerrado; respuesta nueva; contacto; redirecciones. |
| `app/components/PaperSubmissionForm.vue` | Ponencias por el BFF. |
| Eliminados | `app/config/payment.ts`, `app/stores/inscriptionPlans.ts`, `server/api/consultation.post.ts`, `server/api/auth/*`, `server/utils/backend.ts`, `server/utils/api-backend.ts`, `app/utils/api-publica.ts`. |
| `tests/*.test.ts` | Helpers del cliente, BFF con `fetch` simulado y configuración. |
| `.github/workflows/ci.yml`, `docs/*.md` | Variables y flujo actualizados. |

## Riesgos y pendientes

- **Contrato del backend provisional**: la API del sitio aún no tiene archivo de contrato en
  `backend-ciisic`; `contracts/bff-landing.md` la resume y debe reemplazarse por la referencia.
- **IP del visitante**: depende de que Traefik agregue la IP real como última entrada de
  `X-Forwarded-For`; sin proxy (desarrollo) el cliente podría falsearla.
- **Caché en memoria por instancia**: el cierre de inscripciones se refleja con hasta ~60 s de
  retraso (el backend lo impone igual con `409 REGISTRATION_CLOSED`); rotar el token exige reiniciar.
- **Verificación en producción**: depende de la API key de API_UNDC en el backend; sin ella todos
  los estudiantes pagan precio regular (comportamiento esperado y comunicado en el chip).
- **Prueba de punta a punta pendiente**: se hará cuando el backend con `/api/v1/site` y un token de
  prueba esté disponible en `:3010`.

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-multi-evento/
├── spec.md
├── plan.md
├── tasks.md
└── contracts/
    └── bff-landing.md
```

### Source Code (repository root)

```text
app/
├── components/   EstadoInscripciones.vue, NotificationSystem.vue, PaperSubmissionForm.vue
├── composables/  useApi, useEvento, usePlanes, useCatalogos, useConsultation,
│                 useVerificacionEstudiante, useInscription, useFormularioInscripcion
├── pages/        planes, estudiantes, general, confirmation, contacto, login, undc
├── stores/       inscription.ts
├── types/        evento.ts, inscription.ts, index.ts
└── utils/        rutas-sitio, planes, inscripcion, errores-api, verificacion, formato,
                  consulta-dni, catalogos
server/
├── api/publico/  evento, planes, catalogos (GET con caché); consulta-dni/[numero] (GET);
│                 verificacion-estudiante, inscripciones, ponencias, contacto (POST)
└── utils/        api-sitio.ts (núcleo puro), sitio.ts (capa h3)
tests/            *.test.ts (Vitest)
```

**Structure Decision**: proyecto Nuxt único existente; no se agregan paquetes. En `server/` quedan
`api/health.get.ts` y el BFF `api/publico/*`.
