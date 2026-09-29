# Feature Specification: Verificación opcional del correo con Google y configuración desde la API

**Feature Branch**: `feat/multi-evento-sdd`

**Created**: 2026-09-29

**Status**: Implementado; pendiente la prueba integrada con `backend-ciisic` (spec 010, acceso con Google)

**Input**: "La landing deja de usar variables de entorno públicas: el client ID de Google y la URL
del panel se leen de la API del sitio (`GET /config`). En la inscripción se agrega un botón
opcional «Continuar con Google» que verifica el correo (`POST /google-verification`) y envía el
`verificacionCorreoToken` con la inscripción. `/login` redirige al panel configurado y la
confirmación enlaza al estado de la inscripción en el panel."

## Contratos (fuente de verdad)

- API del sitio de `backend-ciisic` (`/api/v1/site`, `X-Api-Key` del evento): `GET /config`,
  `POST /google-verification` y el campo `verificacionCorreoToken` de `POST /inscriptions`
  (spec 010 del backend). Hasta que el backend publique su archivo de contrato, el resumen vive en
  [`../001-landing-multi-evento/contracts/bff-landing.md`](../001-landing-multi-evento/contracts/bff-landing.md).
- Rutas BFF nuevas (propiedad de este repositorio): `GET /api/publico/configuracion` y
  `POST /api/publico/verificacion-google`, en el mismo contrato.

## Decisiones del usuario

- Sin variables de entorno públicas: `.env.example` queda con `NUXT_BACKEND_BASE_URL` y
  `NUXT_BACKEND_EVENT_TOKEN`. Se retira `NUXT_PUBLIC_ADMIN_URL`.
- Google es **opcional** por ahora: las reglas de precio no cambian. Los estudiantes siguen
  obteniendo el precio UNDC solo con la verificación de SIVIRENO (`/student-verification`).
- El tipo de cuenta lo decide el backend con una regla fija: dominio `undc.edu.pe`; parte local
  numérica de 8 a 12 dígitos = `ESTUDIANTE`; otra parte local del dominio = `PERSONAL` (docente o
  administrativo); otro dominio = `EXTERNO`.
- Sin One Tap ni selección automática: solo el botón, en ventana emergente.
- La consulta de DNI (RENIEC) sigue mandando sobre los nombres.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Verificar mi correo con Google al inscribirme (Priority: P1)

Como participante quiero pulsar «Continuar con Google» junto al campo de correo para que mi correo
quede verificado (y, si están vacíos, mis nombres completados), sin escribirlo a mano.

**Why this priority**: es el valor principal de la feature y prepara el acceso al panel con la
misma cuenta de Google.

**Independent Test**: con `/config` devolviendo un client ID de prueba y el backend con Google
configurado, en `/estudiantes` pulsar el botón, elegir una cuenta `@undc.edu.pe` y comprobar el
chip, el correo de solo lectura y que el multipart lleva `verificacionCorreoToken`.

**Acceptance Scenarios**:

1. **Given** la configuración trae `google.clientId`, **When** abro `/estudiantes` o `/general`,
   **Then** veo bajo el correo el texto «Opcional: verifica tu correo con Google (recomendado para
   cuentas @undc.edu.pe)» y el botón «Continuar con Google» (sin saltos de diseño al cargar).
2. **Given** pulso el botón y elijo una cuenta, **When** Google devuelve la credencial, **Then** la
   landing la envía a `POST /api/publico/verificacion-google`, veo «Verificando tu correo con
   Google…» y, al responder el backend, el correo queda fijado y de solo lectura.
3. **Given** la verificación responde `tipoCuenta`, **Then** el chip dice «Estudiante UNDC — tu
   correo institucional quedó verificado» (`ESTUDIANTE`), «Personal UNDC verificado» (`PERSONAL`) o
   «Correo verificado con Google» (`EXTERNO`), anunciado con `aria-live`.
4. **Given** mis nombres y apellidos están vacíos y no vinieron de la consulta de DNI, **When** se
   verifica el correo, **Then** se completan con los de Google (cada campo solo si está vacío).
5. **Given** mis nombres vinieron de la consulta de DNI, **Then** Google no los cambia; y si la
   consulta de DNI llega después, RENIEC reemplaza los nombres completados por Google.
6. **Given** el correo está verificado, **When** envío la inscripción, **Then** el multipart incluye
   `verificacionCorreoToken`; la confirmación indica «Verificado con Google» si el backend responde
   `esCorreoVerificado: true`.
7. **Given** el correo está verificado, **When** pulso «Usar otro correo», **Then** se descarta el
   token (solo existía en memoria), el correo vuelve a ser editable, recupera el foco y la
   inscripción ya no envía `verificacionCorreoToken`.
8. **Given** estoy en `/estudiantes`, **When** Google fija mi correo, **Then** la verificación de
   estudiante UNDC (SIVIRENO) se lanza con ese correo como antes y decide el precio.

---

### User Story 2 - Inscribirme aunque Google no esté disponible (Priority: P1)

Como participante quiero completar mi inscripción escribiendo mi correo si el botón de Google no
aparece o falla.

**Why this priority**: Google es opcional; nunca debe bloquear una inscripción.

**Independent Test**: con `/config` sin `clientId` no aparece nada; con el script de Google
bloqueado (bloqueador de anuncios) aparece un aviso y el formulario se envía sin token.

**Acceptance Scenarios**:

1. **Given** `google.clientId` es `null` (o la configuración no carga), **Then** no se muestra el
   bloque de Google ni se descarga su script.
2. **Given** el script de Google no carga, **Then** veo «No pudimos cargar el botón de Google;
   puedes escribir tu correo.» en el mismo espacio reservado.
3. **Given** el backend responde un error (`GOOGLE_NOT_CONFIGURED`, `GOOGLE_UNAVAILABLE`,
   `INVALID_GOOGLE_TOKEN`, `GOOGLE_EMAIL_NOT_VERIFIED`, `GOOGLE_NOT_AUTHORITATIVE`, `RATE_LIMITED`,
   errores del token del evento o de red), **Then** veo un mensaje en español que dice qué hacer, el
   correo sigue editable y puedo continuar.
4. **Given** cierro la ventana de Google sin elegir cuenta, **Then** no cambia nada.
5. **Given** la verificación sigue en curso, **When** intento enviar, **Then** se me pide esperar
   unos segundos.

---

### User Story 3 - Ir al panel y ver el estado de mi inscripción (Priority: P2)

Como participante u organizador quiero que `/login` me lleve al panel y que la confirmación me
diga dónde ver el estado de mi inscripción.

**Independent Test**: con `urlPanel` en `/config`, `/login` responde 302 hacia esa URL y la
confirmación muestra el enlace a `<urlPanel>/mis-inscripciones`.

**Acceptance Scenarios**:

1. **Given** `urlPanel` configurada, **When** abro `/login`, **Then** se me redirige (302 en SSR,
   redirección externa en navegación cliente).
2. **Given** `urlPanel` es `null` o no es una URL http(s), **Then** `/login` muestra un aviso
   amable sin formulario; si la configuración no cargó, ofrece «Reintentar».
3. **Given** la inscripción se creó y hay `urlPanel`, **Then** `/confirmation` muestra «Ver el estado
   de mi inscripción» (abre `<urlPanel>/mis-inscripciones` en otra pestaña) con el texto «Ingresa
   con la cuenta de Google del correo con el que te inscribiste»; también en el aviso de sesión
   expirada. Sin `urlPanel` no se muestra.

---

### User Story 4 - Configuración sin variables públicas (Priority: P2)

Como organizador quiero configurar Google y el panel desde el backend, sin reconstruir ni
reconfigurar la landing.

**Acceptance Scenarios**:

1. **Given** cambio el client ID o la URL del panel en el backend, **Then** la landing lo refleja
   en máximo ~60 s (caché de Nitro), sin redesplegar.
2. **Given** el build, **Then** `runtimeConfig` no contiene client IDs ni URLs del panel y
   `NUXT_PUBLIC_ADMIN_URL` ya no tiene efecto.

### Edge Cases

- Credencial que no parece un JWT (no es texto, más de 4096 caracteres, sin 3 segmentos
  base64url) → el BFF responde `422 INVALID_GOOGLE_CREDENTIAL` sin llamar al backend.
- Cuerpo JSON mayor a 8 KB en `/api/publico/verificacion-google` → `413 PAYLOAD_TOO_LARGE`.
- Varias verificaciones seguidas → solo cuenta la última; una respuesta tardía se ignora.
- Salir de la página durante la verificación o con la ventana de Google abierta → se cancela la
  petición y el callback deja de apuntar al formulario desmontado.
- Token de verificación vencido (24 h) o de otro correo → el backend lo ignora
  (`esCorreoVerificado: false`); la inscripción se registra igual.
- Carné de extranjería → Google puede completar nombres (no hay consulta de DNI).
- Cambiar el tipo de documento limpia los nombres como antes (también los de Google).
- «Usar otro correo» conserva los nombres completados (siguen editables).
- Un error de Google deja de mostrarse cuando el usuario escribe otro correo.
- `clientId` con formato distinto de `<id>.apps.googleusercontent.com` → se trata como no
  configurado; `urlPanel` que no es http(s) absoluta o con credenciales → no configurada.
- Error de `/config` (backend caído, token inválido) → sin Google y `/login` con «Reintentar»; la
  inscripción funciona igual.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: `GET /api/publico/configuracion` (BFF) llama a `GET /config` con el token del evento,
  con caché de 60 s (clave constante, stale-while-revalidate); los errores no se guardan.
- **FR-002**: `useConfiguracionSitio()` carga la configuración con `useAsyncData` y clave estable
  `configuracion`, valida `clientId` y `urlPanel` y expone `clientIdGoogle`, `urlPanel`, `error` y
  una promesa `listo` para esperar la carga (SSR).
- **FR-003**: `/login` redirige a `urlPanel` (302 en SSR); sin URL muestra un aviso. Se eliminan
  `runtimeConfig.public.adminUrl` y `NUXT_PUBLIC_ADMIN_URL` del código, `.env.example`, README y docs.
- **FR-004**: `/confirmation` enlaza a `<urlPanel>/mis-inscripciones` con el texto de ayuda de
  Google cuando hay `urlPanel`.
- **FR-005**: `POST /api/publico/verificacion-google` (BFF) recibe `{ credential }`, valida que sea
  texto de hasta 4096 caracteres con 3 segmentos base64url y reenvía **solo** `{ idToken }` a
  `POST /google-verification` con `X-Api-Key` y `X-Client-Ip`, sin caché; propaga sin cambios el
  estado y el cuerpo del backend.
- **FR-006**: `useGoogleIdentity()` (solo cliente) inserta `https://accounts.google.com/gsi/client`
  una sola vez y espera su `load` (sin sondeo); llama a `initialize({ client_id, callback,
  auto_select: false, ux_mode: 'popup' })` una vez por client ID con un callback reemplazable;
  dibuja el botón (`continue_with`, `locale: 'es'`, forma `pill`, ancho del contenedor entre 200 y
  400 px); nunca usa One Tap (`prompt()`); llama a `cancel()` al desmontar.
- **FR-007**: `useCorreoGoogle()` maneja los estados `inactivo | verificando | verificado | error`,
  los `datos` (correo, nombres, apellidos, tipoCuenta, esInstitucional) y el
  `verificacionCorreoToken` solo en memoria; `descartar()` los borra.
- **FR-008**: `InscripcionCorreoGoogle` se muestra junto al correo en `/estudiantes` y `/general`
  solo con `clientId`; reserva la altura del botón con un marcador dentro de `<ClientOnly>`; muestra
  un chip `aria-live` con el estado y la acción «Usar otro correo».
- **FR-009**: Al verificar, `useFormularioInscripcion` fija `email`, lo deja de solo lectura
  (`correoBloqueado`) y completa nombres y apellidos vacíos que no vinieron de la consulta de DNI.
- **FR-010**: La inscripción envía `verificacionCorreoToken` solo mientras el correo esté bloqueado
  y coincida con el verificado; sin token el campo se omite.
- **FR-011**: Los códigos `GOOGLE_NOT_CONFIGURED`, `GOOGLE_UNAVAILABLE`, `INVALID_GOOGLE_TOKEN`,
  `INVALID_GOOGLE_CREDENTIAL`, `GOOGLE_EMAIL_NOT_VERIFIED`, `GOOGLE_NOT_AUTHORITATIVE` y
  `RATE_LIMITED` (y los del token del evento, del BFF y de red) tienen mensaje en español
  (`app/utils/errores-api.ts`).
- **FR-012**: `/privacidad` indica que el acceso con Google es opcional y solo se usa para
  verificar el correo.

### Key Entities

- **Configuración del sitio**: `google.clientId` y `urlPanel` (definidos en el backend).
- **Verificación del correo**: correo, nombres, apellidos, `tipoCuenta`, `esInstitucional` y
  `verificacionCorreoToken` (24 h, atado al evento y al correo).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La landing se configura solo con `NUXT_BACKEND_BASE_URL` y `NUXT_BACKEND_EVENT_TOKEN`.
- **SC-002**: Con Google disponible, verificar el correo toma un clic y una selección de cuenta, y
  la inscripción llega al backend con `verificacionCorreoToken`.
- **SC-003**: Sin Google (no configurado, bloqueado o con error) la inscripción se completa igual.
- **SC-004**: Mostrar el botón no provoca saltos de diseño (altura reservada desde el SSR).
- **SC-005**: `lint` (0 errores), `typecheck`, `test` y `build` en verde; el token del evento no
  aparece en el build.

## Assumptions

- El backend (spec 010) implementa `/config` y `/google-verification` con el contrato resumido y
  rechaza credenciales mal formadas con `422 VALIDATION_ERROR`.
- El dominio de cada landing está registrado como «Origen de JavaScript autorizado» del client ID
  en Google Cloud (también `http://localhost:3000` para desarrollo).
- La landing no envía `Cross-Origin-Opener-Policy`; si se agrega, debe ser
  `same-origin-allow-popups` para que funcione la ventana de Google.
- `<urlPanel>/mis-inscripciones` es la página del panel donde el participante ingresa con Google.
