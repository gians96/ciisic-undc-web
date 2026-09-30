---
description: "Tareas de 001-landing-multi-evento"
---

# Tasks: Landing conectada a la API multi-evento

**Input**: [spec.md](./spec.md), [plan.md](./plan.md), [contracts/bff-landing.md](./contracts/bff-landing.md)
y los contratos de `backend-ciisic`.

**Tests**: pedidos explícitamente para los helpers puros (mapeo de planes, mensajes por `code`,
armado del multipart y fecha de pago) y para el BFF (`fetch` simulado: encabezados, IP, token,
errores).

## Format: `[ID] [P?] [Story] Descripción`

- **[P]**: paralelizable (archivos distintos, sin dependencias).
- **[Story]**: historia de la spec (US1…US8).

## Phase 1: Setup

- [x] T001 Inicializar Spec Kit y confirmar la línea base (lint 0 errores, typecheck, test, build)
- [x] T002 Redactar la constitución en `.specify/memory/constitution.md`
- [x] T003 Redactar `spec.md`, `plan.md` y `tasks.md` de esta feature

## Phase 2: Foundational

- [x] T004 `runtimeConfig.public.eventoCodigo` y `adminUrl` en `nuxt.config.ts`; `.env.example` (reemplazado por T035)
- [x] T005 [P] Tipos del contrato en `app/types/evento.ts`
- [x] T006 [P] Rutas de la API pública en `app/utils/api-publica.ts` (reemplazado por T038)
- [x] T007 `useEvento()` con `useAsyncData` en `app/composables/useEvento.ts`
- [x] T008 `normalizeApiError` distingue errores de red (`NETWORK_ERROR`) en `app/composables/useApi.ts` + prueba
- [x] T033 Micro-caché Nitro de 60 s para evento y planes (base del BFF de la Phase 2b)

## Phase 2b: US8 — BFF con token del evento (P1)

- [x] T035 Configuración privada `backendEventToken` y `backendBaseUrl` sin valores en el build; retirar `apiBaseUrl` y `eventoCodigo`; `.env.example`; prueba de que el token no está en `public`
- [x] T036 [P] [US8] Núcleo puro `server/utils/api-sitio.ts` (encabezados `X-Api-Key`/`X-Client-Ip`, IP del visitante, `SITE_NOT_CONFIGURED`, `BACKEND_UNAVAILABLE`, propagación de errores, lectura con límite) + pruebas con `fetch` simulado
- [x] T037 [US8] Capa h3 `server/utils/sitio.ts` y rutas `server/api/publico/*`: evento, planes y catálogos (caché), consulta DNI, verificación, inscripciones y ponencias (multipart, `413`) y contacto
- [x] T038 [US8] Cliente contra el BFF: `app/utils/rutas-sitio.ts`, `useApi` de mismo origen, `useEvento`, `useConsultation`, `useVerificacionEstudiante`, `useInscription`; retirar `server/utils/api-backend.ts` y `app/utils/api-publica.ts`
- [x] T039 [P] [US8] Mensajes para `EVENT_TOKEN_REQUIRED`, `INVALID_EVENT_TOKEN`, `SITE_NOT_CONFIGURED` y `BACKEND_UNAVAILABLE` + pruebas

## Phase 3: US2 — Consulta de DNI (P1)

- [x] T009 [P] [US2] Mapeo de la respuesta y mensajes de error (404/503/429/422/red) en `app/utils/consulta-dni.ts` + pruebas
- [x] T010 [US2] `useConsultation` consulta el DNI en el backend (solo DNI); CE 9–12 caracteres, manual
- [x] T011 [US2] Retirar `server/api/consultation.post.ts`, `xApiToken`/`xApiUrl`, `searchConsultation` y tipos DNI anteriores

## Phase 4: US1 + US4 — Planes, datos de pago e inscripciones cerradas (P1/P2)

- [x] T012 [P] [US1] `mapearPlanes`, `tituloPlan`, regla de precio y `formatearSoles` en `app/utils/planes.ts` / `app/utils/formato.ts` + pruebas
- [x] T013 [US1] `usePlanes(categoria)` con clave `planes:<categoria>` sobre `/api/publico/planes`
- [x] T040 [P] [US1] `useCatalogos()` y clasificaciones desde `/api/publico/catalogos` (etiqueta sin "ESTUDIANTE - ") + pruebas
- [x] T014 [US1] `useFormularioInscripcion()` con la lógica compartida de ambos formularios
- [x] T015 [US1] `estudiantes.vue` y `general.vue`: tarjetas desde la API y medios de pago desde `datosPago`
- [x] T016 [US4] `EstadoInscripciones.vue` (cargando / error con reintento / cerradas) en `/planes`, `/estudiantes` y `/general`
- [x] T017 [US1] Eliminar `app/config/payment.ts` y `app/stores/inscriptionPlans.ts`

## Phase 5: US3 — Verificación de estudiante UNDC (P1)

- [x] T018 [P] [US3] Mensajes por `motivo` y condición de verificación en `app/utils/verificacion.ts` + pruebas
- [x] T019 [US3] `useVerificacionEstudiante()` con debounce, cancelación y descarte de respuestas obsoletas
- [x] T020 [US3] Chip de estado en `/estudiantes`; precio UNDC solo con `esEstudianteUndc === true`; retirar la regla por `@undc.edu.pe`
- [x] T021 [US1] `/general`: precio institucional por `dominioInstitucional` del evento (regla del backend)

## Phase 6: US1 — Envío multipart y validaciones (P1)

- [x] T022 [P] [US1] `mapearFormularioInscripcion`, `construirFormDataInscripcion`, `normalizarFechaPago`, `fechaHoyLima`, celular y voucher en `app/utils/inscripcion.ts` + pruebas (sin `estadoId`/`pago`)
- [x] T023 [P] [US1] `mensajeErrorInscripcion` para todos los `code` del contrato + pruebas
- [x] T024 [US1] `useInscription` → envío multipart (campo `voucher`), tipos en `app/types/inscription.ts`, store tipado
- [x] T025 [US1] Celular de 9 dígitos que empieza con 9, `max` de fecha y misma condición de habilitación de planes en UI y lógica (ambas páginas)

## Phase 7: US5 — Confirmación (P2)

- [x] T026 [US5] `confirmation.vue` con la respuesta nueva, "Precio UNDC aplicado" y contacto del evento

## Phase 8: US6 + US7 — Ponencias, contacto y panel (P3)

- [x] T027 [P] [US6] `PaperSubmissionForm.vue` → `POST /api/publico/ponencias`
- [x] T028 [P] [US6] `contacto.vue` → `POST /api/publico/contacto` con `{ nombres, apellidos, correo, asunto, mensaje }`
- [x] T029 [US7] `/login` redirige a `NUXT_PUBLIC_ADMIN_URL`; eliminar `server/api/auth/*` y `server/utils/backend.ts`
- [x] T034 [P] `/undc` redirige a `/planes` (se conserva la ruta)

## Phase 9: Polish

- [x] T030 [P] Documentación (`docs/*.md`) y CI con las variables finales
- [x] T031 Puertas: `bun run lint`, `bun run typecheck`, `bun run test`, `bun run build`; el token no aparece en `.output/public`
- [x] T032 Verificación manual con el backend local (`/api/v1/site` y token generado en el panel): DNI desde la caché del backend, estudiante UNDC verificado (API_UNDC local), precio UNDC S/ 100 en lugar de S/ 120, voucher PNG, confirmación #29 y aprobación en el panel con credencial PDF (2026-09-29)
- [x] T041 [US1] QR de las billeteras subido en el panel: ruta `GET /api/publico/qr/:archivo` del BFF
      (`obtenerQrSitio`) y `urlQrBilletera` (`qrArchivo` tiene prioridad sobre `qrUrl`), con pruebas
      y verificación local panel → backend → landing (2026-09-30)
- [x] T042 [US1] QR visible en la tarjeta de la billetera (/estudiantes y /general; toca para ampliar y
      «Descargar QR» en el modal); la opción muestra el aplicativo («Yape») aunque en el panel el «Nombre»
      sea el del titular (`nombreBilletera`, `titularBilletera`, `nombreDescargaQr` con pruebas); probado
      con el build de producción en escritorio y a 375 px (2026-09-30)
- [x] T043 [US1] Medios de pago agrupados como en el panel: «Billeteras digitales» (por defecto) y
      «Cuentas bancarias»; subopción de banco o billetera solo con más de uno y cada grupo recuerda su
      elección (`modalidadesDisponibles`, `resolverMedioPago` con pruebas); probado con un backend
      simulado con 1 y con 2 medios por grupo (2026-09-30)

## Dependencies & Execution Order

- Phase 2 bloquea al resto; Phase 2b (BFF) bloquea todas las llamadas del navegador.
- US2 (Phase 3) es independiente de US1.
- Phase 4 introduce el composable compartido que usan las fases 5 y 6.
- Phases 7 y 8 dependen de Phase 2b.
