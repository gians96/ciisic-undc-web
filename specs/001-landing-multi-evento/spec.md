# Feature Specification: Landing conectada a la API multi-evento

**Feature Branch**: `feat/multi-evento-sdd`

**Created**: 2026-09-29

**Status**: Implementado; pendiente la prueba de punta a punta contra `/api/v1/site` con un token de prueba

**Input**: "Actualizar la landing pública del CIISIC a la nueva API multi-evento de backend-ciisic:
evento, tipos de inscripción, datos de pago, consulta de DNI, verificación de estudiante UNDC,
envío de inscripciones, confirmación, papers, contacto y acceso al panel." Ampliado el 2026-09-29:
"cada evento tiene un token de acceso y la landing lo usa solo en el servidor Nitro (BFF)".

## Contratos (fuente de verdad)

Esta spec **no** repite los contratos del backend; se implementa contra:

- API del sitio de `backend-ciisic` (`/api/v1/site`, `X-Api-Key` por evento): resumen provisional
  en [`contracts/bff-landing.md`](./contracts/bff-landing.md) hasta que el backend publique su
  archivo de contrato. Formas de datos y códigos, iguales a:
  - `backend-ciisic/specs/002-multi-evento/contracts/api-publica.md` — evento, tipos de
    inscripción, inscripciones, papers, contacto y errores `{ success: false, code, message, fields? }`.
  - `backend-ciisic/specs/004-verificacion-estudiante/contracts/api-verificacion.md` — verificación
    de estudiante y mensajes sugeridos por `motivo`.
  - `backend-ciisic/specs/003-consultas-dni/contracts/api-consultas.md` — consulta de DNI.
- Rutas BFF de la landing (`server/api/publico/*`, propiedad de este repositorio):
  [`contracts/bff-landing.md`](./contracts/bff-landing.md).

## Decisiones del usuario

- Estudiante UNDC verificado → precio UNDC. Estudiantes de otras universidades pueden elegir los
  planes de estudiante a **precio regular**.
- La verificación se lanza en `/estudiantes` cuando hay DNI de 8 dígitos y correo válido.
- Se elimina la regla anterior de `/estudiantes` que daba el precio UNDC solo porque el correo
  terminaba en `@undc.edu.pe`.
- `/login` ya no autentica en la landing: redirige al panel administrativo (aplicación externa).
- En `/general` se mantiene el precio UNDC para correos del dominio institucional (regla del backend
  para la categoría general).
- Cada evento tiene un token de acceso; la landing lo usa **solo en el servidor Nitro** (BFF). El
  navegador nunca llama al backend: todas las llamadas pasan por `server/api/publico/*`.
- Las lecturas (evento, tipos de inscripción, catálogos) se cachean en Nitro para no depender del
  límite del backend; las acciones del visitante se reenvían sin caché con su IP (`X-Client-Ip`).
- `/undc` (página antigua con precios fijos) redirige a `/planes`; la ruta se conserva para que
  los enlaces antiguos no den 404.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Inscribirse con los datos del evento (Priority: P1)

Como asistente quiero ver los planes vigentes del evento, pagar en las cuentas publicadas por la
organización y enviar mi inscripción con el voucher, para quedar registrado en la edición correcta.

**Why this priority**: es el flujo que genera inscripciones; sin él la landing no cumple su función.

**Independent Test**: con el backend local, completar `/general` con un DNI nuevo y un voucher PNG
y comprobar que la API responde `201` y `/confirmation` muestra la respuesta.

**Acceptance Scenarios**:

1. **Given** el evento del token configurado con inscripciones abiertas, **When** abro `/general`,
   **Then** veo los tipos de la categoría `PUBLICO_GENERAL` (título, etiqueta, precio,
   descripción y características) tal como los devuelve la API, con la tarjeta actual.
2. **Given** elijo depósito bancario o billetera, **When** reviso los datos de pago, **Then** veo
   número de cuenta, CCI, titular, teléfono y QR tomados de `datosPago` del evento, con botón
   para copiar.
3. **Given** datos válidos, plan, medio de pago, número de operación, fecha y voucher, **When**
   envío, **Then** se hace un `multipart/form-data` con los campos del contrato (archivo en
   `voucher`), sin `estadoId`, `pago`, `monto`, `descuento` ni `hasDiscount`, y paso a
   `/confirmation`.
4. **Given** el servidor responde un error del contrato (p. ej. `409 ALREADY_REGISTERED`),
   **When** envío, **Then** veo un mensaje en español que explica qué corregir y el formulario
   conserva mis datos.

---

### User Story 2 - Autocompletar nombres con el DNI (Priority: P1)

Como asistente con DNI quiero que mis nombres se completen solos para no escribirlos y evitar
errores; si la consulta no está disponible quiero poder escribirlos yo.

**Why this priority**: todas las inscripciones pasan por este paso y hoy depende de un proxy con
token en la landing que se elimina.

**Independent Test**: en local no hay tokens de consulta (la API responde `503`): al escribir un
DNI debe aparecer el aviso y los campos de nombres deben quedar editables.

**Acceptance Scenarios**:

1. **Given** un DNI de 8 dígitos existente, **When** termino de escribirlo (o pulso la lupa),
   **Then** se consulta el backend, se completan nombres y apellidos y quedan de solo lectura.
2. **Given** la API responde `404`, **Then** se me indica que no se encontró y puedo escribir mis
   nombres.
3. **Given** la API responde `503`, **Then** veo un mensaje amable ("consulta no disponible") y
   puedo escribir mis nombres.
4. **Given** la API responde `429`, **Then** se me pide esperar y puedo escribir mis nombres.
5. **Given** elijo carné de extranjería, **Then** no se hace consulta y escribo mis nombres.

---

### User Story 3 - Precio UNDC para estudiantes verificados (Priority: P1)

Como estudiante UNDC quiero que, al ingresar mi DNI y mi correo institucional, el sistema confirme
que soy estudiante y me muestre el precio UNDC; como estudiante externo quiero inscribirme igual a
precio regular.

**Why this priority**: regla de negocio decidida por el usuario; evita dar el precio UNDC por un
correo ajeno.

**Independent Test**: en local API_UNDC no está configurada: con DNI y correo `@undc.edu.pe` el chip
debe mostrar "No pudimos verificarte ahora…" y las tarjetas el precio regular; con correo gmail,
el mensaje de correo institucional.

**Acceptance Scenarios**:

1. **Given** estoy en `/estudiantes` con DNI de 8 dígitos y correo válido, **When** dejo de
   escribir, **Then** se llama a `/api/publico/verificacion-estudiante` (con debounce) y veo
   "Verificando…".
2. **Given** la respuesta es `esEstudianteUndc: true`, **Then** veo "Estudiante UNDC verificado ✓
   — se aplica el precio UNDC.", las tarjetas muestran `precioInstitucional` y el
   `verificacionToken` se envía con la inscripción.
3. **Given** la respuesta es `esEstudianteUndc: false`, **Then** veo el mensaje del `motivo`
   (tabla del contrato 004), las tarjetas muestran el precio regular y puedo inscribirme.
4. **Given** cambio el DNI o el correo, **Then** se descarta el resultado anterior (y cualquier
   respuesta tardía), vuelve el precio regular y se verifica de nuevo.
5. **Given** la verificación sigue en curso, **When** intento enviar, **Then** se me pide esperar
   unos segundos.

---

### User Story 4 - Inscripciones cerradas (Priority: P2)

Como organizador quiero que, al cerrar las inscripciones en el panel, la landing deje de mostrar
formularios sin redesplegar.

**Independent Test**: con el evento cerrado en el backend, `/planes`, `/estudiantes` y `/general`
muestran "Inscripciones cerradas".

**Acceptance Scenarios**:

1. **Given** `inscripciones.abiertas = false`, **When** abro `/planes`, `/estudiantes` o
   `/general`, **Then** veo "Inscripciones cerradas" con el contacto del evento y ningún formulario.
2. **Given** el formulario está abierto y el servidor responde `409 REGISTRATION_CLOSED`, **Then**
   veo el mensaje y la página pasa al estado de inscripciones cerradas.

---

### User Story 5 - Confirmación con la respuesta nueva (Priority: P2)

Como asistente quiero ver el resumen de lo que registré (monto que calculó el servidor incluido)
y a quién contactar.

**Acceptance Scenarios**:

1. **Given** la inscripción se creó, **Then** `/confirmation` muestra número, participante, tipo
   (nombre y etiqueta), clasificación, monto, precio regular y descuento, modalidad y datos del
   pago, número de operación, fecha de pago (sin corrimiento de zona horaria), estado, fecha de
   registro y nombre corto del evento.
2. **Given** `descuento > 0`, **Then** se indica "Precio UNDC aplicado".
3. **Given** recargo la página, **Then** veo el aviso de sesión expirada con el contacto del evento.

---

### User Story 6 - Papers y contacto por evento (Priority: P3)

Como autor o visitante quiero que mi paper o mensaje quede asociado al evento de la landing.

**Acceptance Scenarios**:

1. **Given** el formulario de paper completo, **When** envío, **Then** se usa
   `POST /api/publico/ponencias` (backend `POST /papers`) con los campos `data` y `file` de siempre.
2. **Given** el formulario de contacto válido, **When** envío, **Then** se usa
   `POST /api/publico/contacto` (backend `POST /contact`) con
   `{ nombres, apellidos, correo, asunto, mensaje }`.

---

### User Story 7 - Acceso al panel administrativo (Priority: P3)

Como administrador quiero que `/login` me lleve al panel, que ahora es una aplicación aparte.

**Acceptance Scenarios**:

1. **Given** `NUXT_PUBLIC_ADMIN_URL` configurada, **When** abro `/login`, **Then** se me redirige
   (302 en SSR, redirección externa en navegación cliente) al panel.
2. **Given** la variable no está configurada, **Then** veo un aviso sin formulario de credenciales.


---

### User Story 8 - Token del evento solo en el servidor (Priority: P1)

Como organizador quiero que la landing use el token de acceso del evento sin exponerlo, para que
nadie pueda copiarlo desde el navegador y el backend pueda limitar el uso por visitante.

**Why this priority**: el backend ya no acepta llamadas sin token; sin el BFF la landing deja de
funcionar.

**Independent Test**: pruebas unitarias del BFF con `fetch` simulado (encabezados, IP, token
ausente, errores) y búsqueda del token en el bundle del cliente (`.output/public`).

**Acceptance Scenarios**:

1. **Given** una visita a `/estudiantes`, **When** el navegador pide datos o envía el formulario,
   **Then** solo llama a `/api/publico/*` del mismo origen y Nitro agrega `X-Api-Key` y
   `X-Client-Ip` hacia `/api/v1/site/*`.
2. **Given** `NUXT_BACKEND_EVENT_TOKEN` sin configurar, **When** se llama a cualquier ruta del BFF,
   **Then** responde `503 SITE_NOT_CONFIGURED`, se registra el problema en la consola del servidor
   y la página muestra un aviso de servicio no disponible.
3. **Given** el backend responde `401 INVALID_EVENT_TOKEN` o cualquier error del contrato,
   **Then** el BFF devuelve el mismo estado y cuerpo, y la interfaz muestra el mensaje en español.
4. **Given** un voucher o PDF que excede el límite, **When** se envía, **Then** el BFF responde
   `413 UPLOAD_LIMIT_EXCEEDED` sin reenviar el cuerpo.

### Edge Cases

- Backend caído o evento inexistente/archivado (`404 EVENT_NOT_FOUND`) → estado de error con
  "Reintentar"; no se muestra el formulario. Si la caché de Nitro tiene una copia válida, se sigue
  sirviendo mientras se revalida (stale-while-revalidate); los errores nunca se guardan en caché.
- Token ausente (`503 SITE_NOT_CONFIGURED`), requerido (`401 EVENT_TOKEN_REQUIRED`), revocado o
  expirado (`401 INVALID_EVENT_TOKEN`), o backend sin respuesta (`502 BACKEND_UNAVAILABLE`) →
  mensaje de servicio no disponible, sin exponer detalles técnicos.
- Cierre de inscripciones en el panel → la landing lo refleja en máximo ~60 s (caché); mientras
  tanto el backend responde `409 REGISTRATION_CLOSED` y la página pasa al estado cerrado.
- Categoría fuera de la lista blanca en `/api/publico/planes` → `400` sin consultar al backend.
- `X-Forwarded-For` manipulado por el cliente → se toma la **última** IP (la agrega Traefik);
  valores que no son IP válidas se descartan y se usa la del socket.
- Cuerpo mayor al límite (multipart 5 MB + margen, JSON 100 KB) → `413` sin reenviar.
- `datosPago` nulo o sin cuentas → aviso en la sección de pago y no se permite enviar.
- Categoría sin tipos activos → aviso "No hay tipos de inscripción disponibles".
- `precioInstitucional` nulo → se muestra el precio regular.
- Respuesta de verificación que llega después de cambiar DNI o correo → se ignora.
- Fecha de pago futura (hora de Lima) → el selector no la permite (`max`) y se valida al enviar.
- Voucher: PDF, JPG, PNG o WebP de hasta 5 MB en el cliente; el backend valida el contenido
  (`INVALID_FILE_CONTENT`).
- Celular: exactamente 9 dígitos que empiezan con 9.
- Límites de tasa (`429 RATE_LIMITED`) en consulta DNI, verificación, inscripción, contacto y
  papers → mensaje de espera.
- Recarga de `/confirmation` → los datos solo viven en memoria (no hay GET público de
  inscripciones).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La landing se configura con `NUXT_BACKEND_BASE_URL` y `NUXT_BACKEND_EVENT_TOKEN`
  (privadas, solo runtime) y `NUXT_PUBLIC_ADMIN_URL`. Se retiran `NUXT_PUBLIC_API_BASE_URL`,
  `NUXT_PUBLIC_EVENTO_CODIGO`, `xApiToken` y `xApiUrl`.
- **FR-002**: `useEvento()` carga el evento con `useAsyncData` y clave constante `evento`,
  compatible con SSR y compartida entre componentes, desde `GET /api/publico/evento` (backend
  `GET /event`), y expone nombre, fechas, `inscripciones.abiertas`, `contacto`, `datosPago` y
  `dominioInstitucional`.
- **FR-003**: `/estudiantes` y `/general` cargan sus tipos desde
  `GET /api/publico/planes?categoria=ESTUDIANTES|PUBLICO_GENERAL` (backend
  `GET /registration-types`) y los muestran en la tarjeta existente (`title`, `badge` = etiqueta,
  `basePrice` = precio, `institutionalPrice` = precioInstitucional, `description`, `features` =
  características).
- **FR-004**: Con inscripciones cerradas, `/planes`, `/estudiantes` y `/general` muestran
  "Inscripciones cerradas" en lugar de formularios o tarjetas de modalidad.
- **FR-005**: La consulta de DNI usa `GET /api/publico/consulta-dni/:numero` (backend
  `GET /document-lookup/dni/:numero`) solo para DNI; con resultado, nombres y apellidos quedan de
  solo lectura; `404`, `503` y `429` habilitan el ingreso manual con un mensaje específico.
- **FR-006**: En `/estudiantes` la verificación (`POST /api/publico/verificacion-estudiante`) se
  ejecuta con DNI de 8 dígitos y correo válido, con debounce; se repite al cambiar DNI o correo,
  ignora respuestas obsoletas, muestra un chip de estado accesible y conserva `verificacionToken`.
- **FR-007**: El precio mostrado replica la regla del backend (spec 002 FR-005): categoría
  estudiantil → `precioInstitucional` solo si `esEstudianteUndc === true`; categoría general →
  `precioInstitucional` si el correo pertenece a `dominioInstitucional`; en otro caso, precio
  regular. El monto definitivo siempre lo calcula el servidor.
- **FR-008**: Los planes se habilitan cuando los campos obligatorios están completos (documento,
  nombres, apellidos, correo válido y celular válido), con la misma condición en la interfaz y en
  la lógica de ambas páginas.
- **FR-009**: La inscripción se envía como multipart a `POST /api/publico/inscripciones` (backend
  `POST /inscriptions`) con exactamente los campos del contrato; `fechaPago` se toma del selector
  como `YYYY-MM-DD` sin conversión a UTC; nunca se envían `estadoId`, `pago`, `monto`, `descuento`
  ni `hasDiscount`.
- **FR-010**: Cada `code` de error del contrato (`ALREADY_REGISTERED`, `EMAIL_IN_USE`,
  `OPERATION_ALREADY_REGISTERED`, `REGISTRATION_CLOSED`, `REGISTRATION_TYPE_INVALID`,
  `VALIDATION_ERROR` con `fields`, `VOUCHER_REQUIRED`, `INVALID_FILE_CONTENT`,
  `INVALID_FILE_TYPE`, `UPLOAD_LIMIT_EXCEEDED`, `RATE_LIMITED`, `EVENT_NOT_FOUND`) y del token o del
  BFF (`EVENT_TOKEN_REQUIRED`, `INVALID_EVENT_TOKEN`, `SITE_NOT_CONFIGURED`, `BACKEND_UNAVAILABLE`)
  se traduce a un mensaje en español.
- **FR-011**: `/confirmation` muestra la respuesta nueva, "Precio UNDC aplicado" cuando
  `descuento > 0` y el contacto de `useEvento().contacto`.
- **FR-012**: Ponencias y contacto usan `POST /api/publico/ponencias` y `POST /api/publico/contacto`
  (backend `POST /papers` y `POST /contact` con `{ nombres, apellidos, correo, asunto, mensaje }`).
- **FR-013**: `/login` redirige a `NUXT_PUBLIC_ADMIN_URL`; se eliminan `server/api/auth/*`,
  `server/api/consultation.post.ts` y `server/utils/backend.ts`.
- **FR-014**: Los datos de pago provienen de `datosPago`; se elimina `app/config/payment.ts`.
- **FR-015**: El celular se valida en el cliente: 9 dígitos que empiezan con 9.
- **FR-016**: El BFF (`server/api/publico/*`, contrato en `contracts/bff-landing.md`) agrega
  `X-Api-Key` y `X-Client-Ip` a toda llamada; cachea las lecturas (evento y planes 60 s, catálogos
  10 min; errores sin caché); reenvía sin caché y tal cual los cuerpos de las acciones con límites
  de tamaño; propaga estado y cuerpo del backend; responde `503 SITE_NOT_CONFIGURED` si falta la
  configuración. Ninguna llamada del navegador va directo al backend.
- **FR-017**: `/undc` redirige a `/planes` (se conserva la ruta).
- **FR-018**: Las clasificaciones (ciclos) del formulario de estudiantes salen de
  `GET /api/publico/catalogos` (backend `GET /catalogs`), no de opciones fijas ni de rutas legacy.

### Key Entities

Definidas en los contratos del backend; la landing solo las consume:

- **Evento público**: código, nombres, fechas, ventana de inscripciones, dominio institucional,
  contacto y datos de pago.
- **Categoría / Tipo de inscripción**: planes con precio regular e institucional; la categoría
  indica si es estudiantil.
- **Catálogos**: clasificaciones y tipos de documento.
- **Verificación de estudiante**: resultado (`esEstudianteUndc`, `motivo`) y token firmado.
- **Inscripción creada**: respuesta del POST que alimenta la confirmación.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Cambiar de edición solo requiere cambiar `NUXT_BACKEND_EVENT_TOKEN` (y reiniciar):
  planes, precios, datos de pago, catálogos y contacto se actualizan sin tocar código.
- **SC-002**: Una inscripción completa contra el backend local termina en `/confirmation` con los
  datos devueltos por el servidor.
- **SC-003**: El token del evento no aparece en el bundle del cliente, en el payload de SSR ni en
  ninguna respuesta del BFF.
- **SC-004**: Con la consulta de DNI (`503`) y la verificación (`SERVICIO_NO_DISPONIBLE`) caídas,
  el usuario completa su inscripción sin bloqueo.
- **SC-005**: `lint` (0 errores), `typecheck`, `test` y `build` en verde.
- **SC-006**: Con tráfico sostenido, el backend recibe como máximo una lectura de evento y una por
  categoría cada ~60 s por instancia de la landing, sin importar cuántas visitas haya.

## Assumptions

- La landing corre detrás de Traefik (Dokploy), que agrega la IP real del visitante como última
  entrada de `X-Forwarded-For`.
- El token se define en runtime; rotarlo requiere reiniciar la landing.
- No existe GET público de inscripciones: la confirmación usa la respuesta del POST en memoria.
- Los tipos de documento del formulario (DNI 8 dígitos, CE 9–12 caracteres) reflejan la validación
  del backend; el catálogo `tiposDocumento` no se usa para las reglas de longitud.
- Los textos de marketing ("VIII CIISIC 2026", fechas en `/planes`) quedan fuera de alcance.
- La caché de Nitro es en memoria por instancia (suficiente para el despliegue actual de una
  instancia).
