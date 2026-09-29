---
description: "Tareas de 001-landing-multi-evento"
---

# Tasks: Landing conectada a la API multi-evento

**Input**: [spec.md](./spec.md), [plan.md](./plan.md) y los contratos de `backend-ciisic`.

**Tests**: pedidos explícitamente para los helpers puros (mapeo de planes, mensajes por `code`,
armado del multipart y fecha de pago).

## Format: `[ID] [P?] [Story] Descripción`

- **[P]**: paralelizable (archivos distintos, sin dependencias).
- **[Story]**: historia de la spec (US1…US7).

## Phase 1: Setup

- [x] T001 Inicializar Spec Kit y confirmar la línea base (lint 0 errores, typecheck, test, build)
- [x] T002 Redactar la constitución en `.specify/memory/constitution.md`
- [x] T003 Redactar `spec.md`, `plan.md` y `tasks.md` de esta feature

## Phase 2: Foundational

- [x] T004 `runtimeConfig.public.eventoCodigo` y `adminUrl` en `nuxt.config.ts`; `.env.example`
- [x] T005 [P] Tipos del contrato en `app/types/evento.ts`
- [x] T006 [P] Rutas de la API pública en `app/utils/api-publica.ts`
- [x] T007 `useEvento()` con `useAsyncData` y clave `evento:<codigo>` en `app/composables/useEvento.ts`
- [x] T008 `normalizeApiError` distingue errores de red (`NETWORK_ERROR`) en `app/composables/useApi.ts` + prueba
- [x] T033 Micro-caché Nitro de 60 s: `server/api/publico/evento.get.ts`, `planes.get.ts` (lista blanca de categorías) y `server/utils/api-backend.ts`; `useEvento()` lee `/api/publico/evento`; `backendBaseUrl` cae en `apiBaseUrl`; constitución 1.1.0

## Phase 3: US2 — Consulta de DNI (P1)

- [x] T009 [P] [US2] Mapeo de la respuesta y mensajes de error (404/503/429/422/red) en `app/utils/consulta-dni.ts` + pruebas
- [x] T010 [US2] `useConsultation` llama a `GET /document-lookup/dni/:numero` (solo DNI); CE 9–12 caracteres, manual
- [x] T011 [US2] Retirar `server/api/consultation.post.ts`, `xApiToken`/`xApiUrl`, `searchConsultation` y tipos DNI anteriores

## Phase 4: US1 + US4 — Planes, datos de pago e inscripciones cerradas (P1/P2)

- [x] T012 [P] [US1] `mapearPlanes`, `tituloPlan`, regla de precio y `formatearSoles` en `app/utils/planes.ts` / `app/utils/formato.ts` + pruebas
- [ ] T013 [US1] `usePlanes(categoria)` con clave `planes:<codigo>:<categoria>` sobre `/api/publico/planes`
- [ ] T014 [US1] `useFormularioInscripcion()` con la lógica compartida de ambos formularios
- [ ] T015 [US1] `estudiantes.vue` y `general.vue`: tarjetas desde la API y medios de pago desde `datosPago`
- [ ] T016 [US4] `EstadoInscripciones.vue` (cargando / error con reintento / cerradas) en `/planes`, `/estudiantes` y `/general`
- [ ] T017 [US1] Eliminar `app/config/payment.ts` y `app/stores/inscriptionPlans.ts`

## Phase 5: US3 — Verificación de estudiante UNDC (P1)

- [x] T018 [P] [US3] Mensajes por `motivo` y condición de verificación en `app/utils/verificacion.ts` + pruebas
- [x] T019 [US3] `useVerificacionEstudiante()` con debounce, cancelación y descarte de respuestas obsoletas
- [x] T020 [US3] Chip de estado en `/estudiantes`; precio UNDC solo con `esEstudianteUndc === true`; retirar la regla por `@undc.edu.pe`
- [x] T021 [US1] `/general`: precio institucional por `dominioInstitucional` del evento (regla del backend)

## Phase 6: US1 — Envío multipart y validaciones (P1)

- [x] T022 [P] [US1] `mapearFormularioInscripcion`, `construirFormDataInscripcion`, `normalizarFechaPago`, `fechaHoyLima`, celular y voucher en `app/utils/inscripcion.ts` + pruebas (sin `estadoId`/`pago`)
- [x] T023 [P] [US1] `mensajeErrorInscripcion` para todos los `code` del contrato + pruebas
- [x] T024 [US1] `useInscription` → `POST /events/:codigo/inscriptions` (campo `voucher`), tipos en `app/types/inscription.ts`, store tipado
- [x] T025 [US1] Celular de 9 dígitos que empieza con 9, `max` de fecha y misma condición de habilitación de planes en UI y lógica (ambas páginas)

## Phase 7: US5 — Confirmación (P2)

- [x] T026 [US5] `confirmation.vue` con la respuesta nueva, "Precio UNDC aplicado" y contacto del evento

## Phase 8: US6 + US7 — Papers, contacto y panel (P3)

- [ ] T027 [P] [US6] `PaperSubmissionForm.vue` → `POST /events/:codigo/papers`
- [ ] T028 [P] [US6] `contacto.vue` → `POST /events/:codigo/contact`
- [ ] T029 [US7] `/login` redirige a `adminUrl`; eliminar `server/api/auth/*` y `server/utils/backend.ts` (se conserva `backendBaseUrl` para la caché)
- [ ] T034 [P] `/undc` redirige a `/planes` (se conserva la ruta)

## Phase 9: Polish

- [ ] T030 [P] Documentación (`docs/*.md`) y CI sin variables retiradas
- [ ] T031 Puertas: `bun run lint`, `bun run typecheck`, `bun run test`, `bun run build`
- [ ] T032 Verificación manual con el backend local (páginas y una inscripción completa)

## Dependencies & Execution Order

- Phase 2 bloquea al resto. US2 (Phase 3) es independiente de US1.
- Phase 4 introduce el composable compartido que usan las fases 5 y 6.
- Phases 7 y 8 solo dependen de Phase 2 (y del tipo de respuesta de Phase 6 para la confirmación).
