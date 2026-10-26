# Contrato — BFF de la landing (`server/api/publico/*`)

Este repositorio es dueño **solo** de estas rutas (navegador → Nitro, mismo origen). Nitro las
reenvía a la API del sitio de `backend-ciisic` agregando el token del evento.

## API del sitio consumida (backend-ciisic)

> Fuente de verdad: `backend-ciisic/specs/007-tokens-acceso-evento/contracts/api-sitio.md`
> (formas de datos, códigos de error y límites por visitante),
> `008-configuracion-sistema/contracts/api-configuracion.md` (`GET /config`) y
> `010-google-sign-in/contracts/api-google.md` (`POST /google-verification` y
> `verificacionCorreoToken`). Resumen:

- Base `${NUXT_BACKEND_BASE_URL}/api/v1/site`, sin `:codigo` (el evento lo define el token).
- Encabezados: `X-Api-Key: <token del evento>` (obligatorio), `X-Client-Ip: <IP del visitante>`
  (recomendado; el backend lo usa para el límite por visitante solo si el token es válido).
- Aunque el backend abrió CORS (su spec 009), la landing no expone el token: toda llamada del
  navegador pasa por Nitro.
- Errores propios del token: `401 EVENT_TOKEN_REQUIRED`, `401 INVALID_EVENT_TOKEN` (revocado,
  expirado o inexistente), `404 EVENT_NOT_FOUND` (evento archivado).

| Backend | Uso |
|---|---|
| `GET /event` | Evento público (forma `EventoPublico`) |
| `GET /registration-types?categoria=` | Categorías y tipos activos; cada tipo trae `disponiblePara` (`TODOS` \| `INSTITUCIONAL` \| `EXTERNOS`, spec 016 del backend; ausente = `TODOS`) y `modalidad` (modalidad de **asistencia**: `PRESENCIAL` \| `VIRTUAL`, spec 018 del backend; ausente, `null` o desconocida = `PRESENCIAL`) y `excluyeEstudiantesUndc` (booleano, spec 020 del backend: el plan no admite estudiantes UNDC; ausente = `false`) |
| `GET /catalogs` | `{ clasificaciones: [{ id, nombre }], tiposDocumento: [{ id, nombre, abreviatura }] }` |
| `GET /config` | `{ google: { clientId: string \| null }, urlPanel: string \| null }` |
| `POST /inscriptions` | multipart: `participante` JSON + campos + `voucher` (+ `verificacionCorreoToken` opcional); la respuesta agrega `esCorreoVerificado` y `tipoInscripcion.modalidad` (spec 018; ausente = `PRESENCIAL`); `422 REGISTRATION_TYPE_NOT_AVAILABLE` si el tipo no corresponde a la persona (spec 016 del backend) |
| `POST /student-verification` | JSON `{ correo, tipoDocumento, numeroDocumento }` |
| `POST /google-verification` | JSON `{ idToken }` (ver abajo) |
| `GET /document-lookup/dni/:numero` | `404 DOCUMENT_NOT_FOUND`, `503 LOOKUP_UNAVAILABLE`, `429` |
| `GET /payment-qr/:archivo` | Imagen del QR de una billetera (`qrArchivo`), solo del evento del token (spec 012 del backend) |
| `POST /papers` | multipart: `data` JSON + `file` PDF |
| `POST /contact` | JSON `{ nombres, apellidos, correo, asunto, mensaje }` |
| `GET /specialized-talks` | Ponencias especializadas `publicada`s del evento con `cuposDisponibles` y `llena` (aforo **presencial**), sin datos de inscritos (spec 019 del backend); `meta.accesoLibre` dice si el evento se inscribe solo con el documento (spec 030; ausente = libre) |
| `POST /specialized-talk-eligibility` | JSON `{ tipoDocumento: 'dni'\|'ce', numeroDocumento, correo }` → `{ nombres, modoAsistencia: 'PRESENCIAL'\|'VIRTUAL', tipo, categoria }` si es un congresista con el pago aprobado. Errores: `422 CONGRESS_REGISTRATION_NOT_FOUND` (documento o correo no coinciden; mismo mensaje), `422 CONGRESS_PAYMENT_PENDING`, `422 CONGRESS_REGISTRATION_REJECTED`, `409 FREE_ACCESS_ENABLED` (spec 030 del backend) |
| `GET /specialized-talk-occupancy` | Aforo con el **enlace público** del Owner (spec 036 del backend): además del token del evento, el del enlace en `X-Link-Token`. Por ponencia publicada: `cupo`, `inscritos` (solo presenciales vigentes), `cuposDisponibles`, `llena`, `asistentes` y `personas` (inscritos vigentes con **solo** `nombre`, `modo` y `asistioEn`; ausente en un backend anterior); ponentes sin biografía. `404 LINK_NOT_FOUND` (el mismo para un token faltante, mal formado, desconocido, desactivado o de otro evento) |
| `POST /specialized-talk-registrations` | JSON `{ asistente: { tipoDocumento: 'dni'\|'ce', numeroDocumento, nombres?, apellidos?, correo?, celular?, procedencia?: 'INTERNO'\|'EXTERNO' }, ponenciaIds: [1–4] }`; todo o nada. Sin acceso libre solo viajan `tipoDocumento`, `numeroDocumento` y `correo` (obligatorio); nombres, celular y procedencia salen del congreso y la respuesta trae `modoAsistencia`. Errores: `409 TALK_FULL` (solo presencial), `409 SCHEDULE_CONFLICT`, `409 TALK_ENDED`, `404 TALK_NOT_FOUND`, `422 PAID_TALK_UNAVAILABLE`, `422 NAMES_REQUIRED`, `422 VALIDATION_ERROR`, `422 CONGRESS_*` |

### Verificación del correo con Google (lo que usa la landing)

- `POST /google-verification` con `{ idToken }` →
  `{ correo, nombres, apellidos, tipoCuenta: 'ESTUDIANTE' | 'PERSONAL' | 'EXTERNO', esInstitucional, verificacionCorreoToken }`.
  El tipo de cuenta lo decide el backend (dominio `undc.edu.pe`; parte local de 8 a 12 dígitos =
  estudiante, otra = personal; otro dominio = externo).
- `verificacionCorreoToken` (24 h, mismo evento y correo) viaja opcionalmente en `POST /inscriptions`,
  que responde `esCorreoVerificado`. No cambia el precio.
- Códigos que la landing traduce (`mensajeErrorGoogle`): `GOOGLE_NOT_CONFIGURED`, `GOOGLE_UNAVAILABLE`,
  `INVALID_GOOGLE_TOKEN`, `GOOGLE_EMAIL_NOT_VERIFIED`, `GOOGLE_NOT_AUTHORITATIVE`, `VALIDATION_ERROR`,
  `RATE_LIMITED` y los comunes del sitio.

## Rutas del BFF

| Ruta (landing) | Backend | Caché | Límite de cuerpo |
|---|---|---|---|
| `GET /api/publico/evento` | `GET /event` | 60 s, clave constante | — |
| `GET /api/publico/planes?categoria=ESTUDIANTES\|PUBLICO_GENERAL\|FI_UNDC` | `GET /registration-types` | 60 s por categoría (lista blanca) | — |
| `GET /api/publico/catalogos` | `GET /catalogs` | 10 min, clave constante | — |
| `GET /api/publico/configuracion` | `GET /config` | 60 s, clave constante | — |
| `GET /api/publico/consulta-dni/:numero` | `GET /document-lookup/dni/:numero` | no (`no-store`) | — |
| `GET /api/publico/qr/:archivo` | `GET /payment-qr/:archivo` | `public, max-age=86400, immutable` (navegador/CDN) | — |
| `POST /api/publico/verificacion-estudiante` | `POST /student-verification` | no | JSON, 100 KB |
| `POST /api/publico/verificacion-google` | `POST /google-verification` | no | JSON, 8 KB |
| `POST /api/publico/inscripciones` | `POST /inscriptions` | no | multipart, 5 MB + 512 KB |
| `POST /api/publico/ponencias` | `POST /papers` | no | multipart, 5 MB + 512 KB |
| `POST /api/publico/contacto` | `POST /contact` | no | JSON, 100 KB |
| `GET /api/publico/ponencias-especializadas` | `GET /specialized-talks` | 15 s, clave constante | — |
| `POST /api/publico/ponencias-especializadas/inscripciones` | `POST /specialized-talk-registrations` | no | JSON, 100 KB |
| `POST /api/publico/ponencias-especializadas/elegibilidad` | `POST /specialized-talk-eligibility` | no (el documento y el correo van en el cuerpo, nunca en la URL) | JSON, 100 KB |
| `GET /api/publico/credencial/:codigo` | `GET /credential/:codigo` (spec 038 del backend) | no (`no-store`; el código se normaliza a mayúsculas y, si no tiene 10 caracteres `[0-9A-Z]`, responde `422 INVALID_CODE` sin consultar) | — |
| `POST /api/publico/credencial/:codigo/tecnologias` | `POST /credential/:codigo/technologies` (`{ tecnologias }`) | no (`no-store`; mismo código) | JSON, 2 KB |
| `POST /api/publico/ponencias-especializadas/aforo` | `GET /specialized-talk-occupancy` con `X-Link-Token` | no (`no-store`, `noindex`; el token llega en el cuerpo `{ token }` y nunca va en una URL; sin la forma del backend —43 caracteres base64url— responde `404 LINK_NOT_FOUND` sin consultarlo) | JSON, 1 KB |

Reglas comunes:

- **Modalidad de asistencia (spec 005 de esta landing, spec 018 del backend)**: `modalidad` es un campo
  **aditivo** que vive siempre dentro del objeto del tipo (`tipo.modalidad`, `tipoInscripcion.modalidad`),
  nunca en la raíz de la inscripción, donde `modalidadPago` es otra cosa (`banco` \| `billetera`). El BFF
  reenvía el JSON sin transformarlo, no cambia la lista blanca de categorías (los tipos virtuales viven dentro
  de `ESTUDIANTES` y `PUBLICO_GENERAL`) y la landing **no envía** la modalidad en `POST /inscripciones`: la
  deduce el servidor del tipo elegido. Sin el campo (backend anterior) todo equivale a `PRESENCIAL`.
- El cuerpo se reenvía tal cual (mismo `Content-Type`, incluido el `boundary` del multipart),
  salvo en `/verificacion-google`: el navegador envía `{ credential }` (la respuesta de Google
  Identity Services) y el BFF reenvía solo `{ idToken: credential }` como `application/json`.
- `/api/publico/configuracion` devuelve el cuerpo del backend; el cliente descarta un `clientId` que
  no termine en `.apps.googleusercontent.com` y una `urlPanel` que no sea http(s) absoluta.
- El estado HTTP y el cuerpo de la respuesta del backend se devuelven sin cambios (éxito y error);
  no se reenvían encabezados del backend. Las respuestas `>= 400` nunca se guardan en caché.
- `X-Client-Ip`: última IP de `X-Forwarded-For` (la agrega Traefik) o la del socket, solo si
  `net.isIP` la acepta (`::ffff:a.b.c.d` se normaliza a IPv4).
- El token nunca aparece en respuestas ni en logs.
- `/api/publico/qr/:archivo` es la única ruta binaria: solo acepta nombres `qr-<uuid>.<png|jpg|webp>`
  (otro nombre → `404` sin llamar al backend) y solo devuelve respuestas `image/png`, `image/jpeg` o
  `image/webp` (otra cosa → `502`). La billetera usa esa ruta si tiene `qrArchivo`; si no, su `qrUrl`.

Errores que genera el propio BFF (misma forma `{ success: false, code, message }`):

| Estado | `code` | Cuándo |
|---|---|---|
| 503 | `SITE_NOT_CONFIGURED` | Falta `NUXT_BACKEND_EVENT_TOKEN` o `NUXT_BACKEND_BASE_URL` (se registra en la consola del servidor) |
| 502 | `BACKEND_UNAVAILABLE` | El backend no respondió (red, timeout) o respondió un error sin cuerpo JSON |
| 413 | `UPLOAD_LIMIT_EXCEEDED` | Multipart mayor al límite (`Content-Length` declarado o bytes leídos) |
| 413 | `PAYLOAD_TOO_LARGE` | JSON mayor a 100 KB (8 KB en `/verificacion-google`) |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | `Content-Type` distinto de multipart o JSON según la ruta |
| 400 | `INVALID_CATEGORY` | `categoria` fuera de la lista blanca |
| 422 | `INVALID_DNI` | `:numero` no tiene 8 dígitos (no se consulta al backend) |
| 422 | `INVALID_GOOGLE_CREDENTIAL` | `credential` falta, no es texto, supera 4096 caracteres o no tiene 3 segmentos base64url, o el cuerpo no es JSON (no se consulta al backend) |
