# AGENTS.md — ciisic-undc-web (landing del congreso)

Guía para agentes de IA y desarrolladores que trabajen en este repositorio.

## Qué es

Landing pública del Congreso CIISIC (UNDC): información del evento, inscripción (estudiantes y
público general), ponencias y contacto. Cada despliegue corresponde a **un evento**, definido por
el token de acceso configurado en el servidor. Documentación: [`docs/`](docs/README.md).

## Entorno y comandos

- Nuxt 4 (SSR) + Nitro, Tailwind CSS v3 vía `@nuxtjs/tailwindcss` (se mantiene en este repo),
  Pinia, Vitest. Gestor: **bun** (`bun install`).
- Variables privadas de runtime (ver [`.env.example`](.env.example)):
  `NUXT_BACKEND_BASE_URL` y `NUXT_BACKEND_EVENT_TOKEN`. El Encuentro de Egresados usa el Google
  Forms oficial versionado en código y el corte fijado en `nuxt.config.ts`; no depende de variables
  locales, no usa credenciales ni accede a Sheets. El client ID de Google y la URL del panel general
  siguen viniendo del backend.
- Comandos:

  | Tarea | Comando |
  |---|---|
  | Desarrollo (puerto 3000) | `bun run dev` |
  | Tipos · lint · pruebas | `bun run typecheck` · `bun run lint` · `bun run test` |
  | Build · producción | `bun run build` · `bun run start` |

- Para desarrollar necesitas backend-ciisic en `http://localhost:3010` y un token de acceso del
  evento generado en el panel (Eventos → Acceso).

## Arquitectura

- `app/pages/`: `index` (landing del evento), `planes`, `estudiantes`, `general`, `fi-undc`, `confirmation`,
  `papers/*`, `semana-sistemica/*` (Comparsa, Reinado, Talleres, E-Sports, Programación, Hackathon,
  Cyber Clash, Encuentro de Egresados y Deportes, con el contenido estático de `app/data/semana-sistemica.ts`), 
  `ponencias-especializadas` (ponentes y temas, datos estáticos de `app/data/ponencias-especializadas.ts`), 
  `inscripcion-ponencias` (inscripción a ponencias especializadas con las ponencias y cupos del backend), 
  `delegaciones` (inscripción de delegaciones con vouchers múltiples; **oculta**, sin enlaces), 
  `contacto`, `login` (redirige al panel), páginas informativas.
- `app/composables/`: `useFormularioInscripcion` (formulario compartido), `useEvento`,
  `usePlanes`, `useCatalogos`, `usePonenciasEspecializadas`, `useConsultation` (DNI), `useVerificacionEstudiante`,
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
- Los planes con `disponiblePara` «solo comunidad UNDC» o «solo externos» se ocultan con la misma
  condición del precio (`planDisponible`); el backend igual los rechaza (`REGISTRATION_TYPE_NOT_AVAILABLE`).
- **Modalidad de asistencia** (`PRESENCIAL` | `VIRTUAL`): atributo del **tipo** de inscripción
  (`tipo.modalidad`, `tipoInscripcion.modalidad`; ausente, `null` o desconocida = `PRESENCIAL`). Los planes
  virtuales viven dentro de `ESTUDIANTES` y `PUBLICO_GENERAL` con `precio == precioInstitucional`; la landing
  los agrupa por modalidad, **nunca envía** la modalidad en el POST (la deduce el servidor) y no bloquea nada
  ni promete acceso, horas o certificado (textos neutros: la organización compartirá las indicaciones).
  Terminología: la «modalidad» de asistencia **no es** `ModalidadPago` (`banco` | `billetera`, en el pago) ni
  las tarjetas «Modalidad 0N» de `/planes` (categorías), ni el «fotocheck virtual» del portal. Ver
  `specs/005-modalidad-virtual/`.
- **Planes sin estudiantes UNDC** (spec 007; contrato en la spec 020 del backend): `tipo.excluyeEstudiantesUndc`
  (lo enciende el panel en los planes virtuales) oculta el plan al estudiante UNDC —verificado con SIVIRENO o con
  correo `<8–12 dígitos>@<dominio>`, `esEstudianteUndcDelFormulario`— con `planDisponible(plan, institucional,
  estudianteUndc)`; docentes, administrativos y externos lo siguen viendo. El backend igual rechaza con
  `REGISTRATION_TYPE_NOT_AVAILABLE`; `/planes` y la FAQ aclaran que los estudiantes UNDC se inscriben de forma
  presencial solo si la API marca un plan virtual con el interruptor. Ausente = `false`. Un estudiante con correo
  no institucional no se detecta.
- **Ponencias especializadas** (spec 006; contrato en la spec 019 del backend): la página
  `/inscripcion-ponencias` es **plana** (una carpeta `pages/ponencias-especializadas/` convertiría en ruta padre
  a la página estática `ponencias-especializadas.vue` y la rompería). Solo ofrece las gratuitas con cupo; en cada
  horario se elige una (al elegirla se ocultan las demás de ese horario y se pasa al siguiente bloque; quitarla
  las vuelve a mostrar; hay un buscador por tema, ponente, ambiente, hora o día); el servidor decide cupos,
  cruces y nombres (con DNI usa los oficiales) y nunca modifica a una persona ya registrada. En la landing son
  obligatorios el documento, el correo y el celular (el backend los deja opcionales para el staff en puerta).
  Los datos estáticos de `/ponencias-especializadas` (ponentes y temas) no se tocan.
- **Delegaciones** (spec 008; contrato en la spec 023 del backend): la página `/delegaciones` es **oculta** (`noindex`, sin
  enlaces en el menú ni en el pie; el delegado recibe el link por correo). Registro nuevo en `/delegaciones`; con
  `/delegaciones?delegacion=<código>` el delegado ve su grupo y **solo agrega** integrantes y vouchers (sin borrar ni
  editar). **El backend decide el tipo y el precio**: la landing solo envía la `modalidad` (Presencial: S/ 60 con menos de
  10 integrantes y S/ 50 desde 10; Virtual: S/ 30 sin escalas, y solo se ofrece si `tarifa.virtual` no es `null`) y el monto
  que dice cada voucher; el total en pantalla es un estimado (`estimarGrupo`). Hasta 6 vouchers por envío, un archivo por
  voucher en el mismo orden que sus datos (multipart `pagos` + `vouchers`; el BFF admite 6 × 5 MB). Un DNI de 7 dígitos
  (Excel pierde el cero) se completa a 8 (`normalizarDni`). El BFF valida el código del link (`codigoLinkValido`).
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
**contrato 3**, API del sitio, y usa el contrato 5 para Google). Este repositorio consume
backend-ciisic `/api/v1/site/*` con el token del evento desde su servidor. El Encuentro de Egresados
no modifica contratos, pagos ni inscripciones del backend: abre el Google Forms oficial en otra pestaña.

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
- Un agente por repositorio a la vez. Al empezar: `git status` and `git log --oneline -10`; si hay
  cambios sin comitear que no son tus, detente y coordina.
- No modifiques backend-ciisic ni el panel desde aquí: pide el cambio con el contrato propuesto.
- Git: rama `feat/*` (la de producción documentada es `rama-beni`: nunca la reescribas);
  `git add <rutas explícitas>`; commits convencionales en español; sin push, merge ni despliegues
  sin confirmación humana.
- Al terminar, reporta commits, pruebas y pendientes.

## SDD con Spec Kit

Constitución: [`.specify/memory/constitution.md`](.specify/memory/constitution.md). Specs:
`specs/001-landing-multi-evento/` (landing multi-evento + BFF), `specs/002-google-en-inscripcion/`,
`specs/003-disponibilidad-planes/` (planes solo UNDC o solo externos), `specs/004-semana-sistemica/`
(tab «Semana Sistémica»), `specs/005-modalidad-virtual/` (modalidad de asistencia virtual),
`specs/006-inscripcion-ponencias/` (inscripción a ponencias especializadas),
`specs/007-virtual-sin-estudiantes-undc/` (planes que no admiten estudiantes UNDC) y
`specs/008-delegaciones/` (inscripción de delegaciones, página oculta).
Flujo: spec → plan → tasks; marcar tasks al implementar.

## Antes de dar por terminado

1. `bun run typecheck`, `bun run lint` (0 errores), `bun run test` y `bun run build` en verde.
2. El token del evento no aparece en `.output` ni en el HTML servido.
3. Probar el flujo afectado contra el backend local (inscripción, DNI, verificación, Google si aplica).
4. Documentación de `docs/` y contratos del BFF al día.
