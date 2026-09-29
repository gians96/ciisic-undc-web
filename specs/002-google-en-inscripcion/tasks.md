---
description: "Tareas de 002-google-en-inscripcion"
---

# Tasks: Verificación opcional del correo con Google y configuración desde la API

**Input**: [spec.md](./spec.md), [plan.md](./plan.md) y el contrato de rutas BFF
[`../001-landing-multi-evento/contracts/bff-landing.md`](../001-landing-multi-evento/contracts/bff-landing.md).

**Tests**: pedidos para los mensajes y la regla de nombres (`tests/google.test.ts`), el multipart con
y sin `verificacionCorreoToken` (`tests/inscripcion.test.ts`), el reenvío de `/google-verification`
(`tests/bff.test.ts`) y la ausencia de client ID y URL del panel en `runtimeConfig`
(`tests/config.test.ts`).

## Format: `[ID] [P?] [Story] Descripción`

- **[P]**: paralelizable (archivos distintos, sin dependencias).
- **[Story]**: historia de la spec (US1…US4).

## Phase 1: Setup

- [ ] T001 Enmendar la constitución (2.1.0): configuración del navegador desde la API del sitio y scripts de terceros
- [ ] T002 Redactar `spec.md`, `plan.md` y `tasks.md`; agregar las rutas nuevas a `001/contracts/bff-landing.md`

## Phase 2: Foundational — BFF

- [ ] T003 [P] `adaptarVerificacionGoogle` y `esCredencialGoogle` en `server/utils/api-sitio.ts`; opciones `limiteBytes` y `adaptar` en `reenviarCuerpoSitio` (`server/utils/sitio.ts`)
- [ ] T004 `server/api/publico/configuracion.get.ts` (caché 60 s) y `verificacion-google.post.ts` (sin caché); rutas en `app/utils/rutas-sitio.ts`
- [ ] T005 [P] Pruebas del BFF: `credential` → `{ idToken }`, credenciales inválidas (422), errores del backend propagados y ruta h3 con evento simulado (`tests/bff.test.ts`)

## Phase 3: US4 + US3 — Configuración y panel (P2)

- [ ] T006 [P] [US4] Tipos de `/config`, `normalizarConfiguracionSitio`, `urlPanelValida`, `clientIdGoogleValido` y `urlMisInscripciones` en `app/utils/configuracion-sitio.ts` + pruebas
- [ ] T007 [US4] `useConfiguracionSitio()` con `useAsyncData('configuracion')` y promesa `listo`
- [ ] T008 [US3] `/login` redirige a `urlPanel` (302) o muestra el aviso / «Reintentar»; retirar `adminUrl` de `nuxt.config.ts` y `NUXT_PUBLIC_ADMIN_URL` de `.env.example`; prueba de `runtimeConfig` sin client ID ni URL del panel
- [ ] T009 [US3] `/confirmation`: «Ver el estado de mi inscripción» → `<urlPanel>/mis-inscripciones` con el texto de ayuda (también en sesión expirada)

## Phase 4: US1 + US2 — Google en la inscripción (P1)

- [ ] T010 [P] [US1] `app/types/google-identity-services.d.ts` (copiado de app-web-sigenet, con `ux_mode` y `cancel()`, sin `prompt()`)
- [ ] T011 [P] [US1] Mensajes por `tipoCuenta` y por estado, `mapearVerificacionGoogle`, `nombresDesdeGoogle` y `tokenCorreoParaEnvio` en `app/utils/google.ts` + pruebas
- [ ] T012 [P] [US2] `mensajeErrorGoogle` para los códigos de Google, del sitio y de red en `app/utils/errores-api.ts` + pruebas
- [ ] T013 [P] [US1] Núcleo de GIS en `app/utils/google-identity.ts` (script una vez con `load`, `initialize` por client ID, callback reemplazable, opciones del botón, `cancel()`) + pruebas con DOM simulado
- [ ] T014 [US1] `useGoogleIdentity()` (solo cliente, ancho del contenedor) y `useCorreoGoogle()` (estados, datos, token en memoria, `descartar()`)
- [ ] T015 [US1] `InscripcionCorreoGoogle` (marcador de altura fija, `<ClientOnly>`, chip `aria-live`, «Usar otro correo») e `InscripcionBotonGoogle`
- [ ] T016 [US1] `useFormularioInscripcion`: correo fijado y de solo lectura, nombres según la regla, espera durante la verificación y `verificacionCorreoToken` en el multipart (`app/utils/inscripcion.ts` + tipos + pruebas)
- [ ] T017 [US1] `estudiantes.vue` y `general.vue`: componente junto al correo y `:readonly="correoBloqueado"`; confirmación con «Verificado con Google»
- [ ] T018 [P] [US1] `/privacidad`: el acceso con Google es opcional y solo verifica el correo

## Phase 5: Polish

- [ ] T019 [P] README y `docs/*.md` sin `NUXT_PUBLIC_ADMIN_URL`; configuración desde el backend, orígenes autorizados de Google y flujo con `verificacionCorreoToken`
- [ ] T020 Puertas: `bun run lint` (0 errores), `bun run typecheck`, `bun run test`, `bun run build`; el token del evento no aparece en `.output`
- [ ] T021 Prueba integrada con el backend (spec 010) y un client ID de prueba (a cargo del usuario)

## Dependencies & Execution Order

- Phase 2 (BFF) bloquea las llamadas del navegador de las fases 3 y 4.
- T006–T007 bloquean `/login`, `/confirmation` y el `clientId` del componente de Google.
- T010–T014 bloquean T015; T015 bloquea T016–T017.
