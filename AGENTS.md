# AGENTS.md — ciisic-undc-web (landing del congreso)

Guía para agentes de IA y desarrolladores que trabajen en este repositorio.

## Qué es

Landing pública del Congreso CIISIC (UNDC): información del evento, inscripción (estudiantes y
público general), ponencias y contacto. Cada despliegue corresponde a **un evento**, definido por
el token de acceso configurado en el servidor. Documentación: [`docs/`](docs/README.md).

## Entorno y comandos

- Nuxt 4 (SSR) + Nitro, Tailwind CSS v3 vía `@nuxtjs/tailwindcss` (se mantiene en este repo),
  Pinia, Vitest. Gestor: **bun** (`bun install`).
- Variables (runtime, solo servidor; ver [`.env.example`](.env.example)):
  `NUXT_BACKEND_BASE_URL` y `NUXT_BACKEND_EVENT_TOKEN`. Nada más: el client ID de Google y la URL
  del panel vienen del backend.
- Comandos:

  | Tarea | Comando |
  |---|---|
  | Desarrollo (puerto 3000) | `bun run dev` |
  | Tipos · lint · pruebas | `bun run typecheck` · `bun run lint` · `bun run test` |
  | Build · producción | `bun run build` · `bun run start` |

- Para desarrollar necesitas backend-ciisic en `http://localhost:3010` y un token de acceso del
  evento generado en el panel (Eventos → Acceso).

## Arquitectura

- `app/pages/`: `index` (landing del evento), `planes`, `estudiantes`, `general`, `confirmation`,
  `papers/*`, `contacto`, `login` (redirige al panel), páginas informativas.
- `app/composables/`: `useFormularioInscripcion` (formulario compartido), `useEvento`,
  `usePlanes`, `useCatalogos`, `useConsultation` (DNI), `useVerificacionEstudiante`,
  `useCorreoGoogle` + `useGoogleIdentity` (Google opcional), `useConfiguracionSitio`.
- `app/utils/`: lógica pura y probada (rutas del sitio, inscripción, verificación, Google, errores).
- `server/api/publico/*`: BFF hacia `/api/v1/site/*` (ver [`docs/arquitectura.md`](docs/arquitectura.md)).
- `server/utils/api-sitio.ts` y `sitio.ts`: token, IP del visitante, reenvío y errores.

## Convenciones de código

- TypeScript; lógica en funciones puras de `app/utils` y `server/utils` con pruebas Vitest;
  componentes con estados de carga, vacío y error; textos en español.
- Accesibilidad: labels, `aria-live` en estados de verificación, radios accesibles en planes.
- No introducir nuevas variables `NUXT_PUBLIC_*` con datos del backend: se leen de la API del sitio.

## Reglas de negocio clave (no romper)

- El navegador **nunca** llama al backend ni conoce el token del evento; todo pasa por Nitro.
- El precio lo calcula el backend; la landing solo muestra. El precio UNDC de estudiantes
  requiere la verificación de SIVIRENO (token firmado por el backend).
- Google es **opcional**: prueba el correo y autocompleta; no cambia precios ni bloquea la
  inscripción si falla.
- La consulta DNI, si falla, permite escribir los nombres; el backend usa los nombres oficiales
  cuando existen.
- Voucher obligatorio (PDF, JPG, PNG o WebP ≤ 5 MB); fecha de pago no futura (hora de Lima).

## Seguridad

- `NUXT_BACKEND_EVENT_TOKEN` solo como variable runtime del servidor: nunca en el build, en
  `NUXT_PUBLIC_*`, en el repositorio ni en logs. Comprobar tras `bun run build` que no aparece en `.output`.
- No enviar `Cross-Origin-Opener-Policy: same-origin` (rompe la ventana de Google); si se agrega CSP,
  permitir `accounts.google.com/gsi/*`.

## Ecosistema y comunicación entre sistemas

Contratos: `backend-ciisic/docs/arquitectura-ecosistema.md` (esta landing es el consumidor del
**contrato 3**, API del sitio, y usa el contrato 5 para Google). Este repositorio **no expone
API**; **consume** backend-ciisic `/api/v1/site/*` con el token del evento desde su servidor.

| Sistema | Repositorio | Relación |
|---|---|---|
| API del congreso | `gians96/backend-ciisic` | Proveedor: API del sitio, configuración (Google, URL del panel) |
| Panel del congreso | `gians96/administrator-ciisic-frontend` | Genera el token de acceso del evento; `/login` y "Mis inscripciones" redirigen allí |
| API_UNDC, deportes-fi | otros repos | Sin comunicación directa (el backend los consume) |

Puertos locales: landing 3000 · panel 3001 · backend-ciisic 3010 · API_UNDC 3020 · deportes-fi 3030.

**Protocolo de cambio de contrato**: el cambio empieza en backend-ciisic (spec + `contracts/` +
`docs/arquitectura-ecosistema.md`); esta landing se adapta en su propia rama y se actualiza
`specs/001-landing-multi-evento/contracts/bff-landing.md`; prueba integrada local antes de desplegar.

**Trabajo con agentes (varias sesiones en paralelo)**:
- Un agente por repositorio a la vez. Al empezar: `git status` y `git log --oneline -10`; si hay
  cambios sin comitear que no son tuyos, detente y coordina.
- No modifiques backend-ciisic ni el panel desde aquí: pide el cambio con el contrato propuesto.
- Git: rama `feat/*` (la de producción documentada es `rama-beni`: nunca la reescribas);
  `git add <rutas explícitas>`; commits convencionales en español; sin push, merge ni despliegues
  sin confirmación humana.
- Al terminar, reporta commits, pruebas y pendientes.

## SDD con Spec Kit

Constitución: [`.specify/memory/constitution.md`](.specify/memory/constitution.md). Specs:
`specs/001-landing-multi-evento/` (landing multi-evento + BFF) y `specs/002-google-en-inscripcion/`.
Flujo: spec → plan → tasks; marcar tasks al implementar.

## Antes de dar por terminado

1. `bun run typecheck`, `bun run lint` (0 errores), `bun run test` y `bun run build` en verde.
2. El token del evento no aparece en `.output` ni en el HTML servido.
3. Probar el flujo afectado contra el backend local (inscripción, DNI, verificación, Google si aplica).
4. Documentación de `docs/` y contratos del BFF al día.
