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
| `GET /registration-types?categoria=` | Categorías y tipos activos; cada tipo trae `disponiblePara` (`TODOS` \| `INSTITUCIONAL` \| `EXTERNOS`, spec 016 del backend; ausente = `TODOS`) |
| `GET /catalogs` | `{ clasificaciones: [{ id, nombre }], tiposDocumento: [{ id, nombre, abreviatura }] }` |
| `GET /config` | `{ google: { clientId: string \| null }, urlPanel: string \| null }` |
| `POST /inscriptions` | multipart: `participante` JSON + campos + `voucher` (+ `verificacionCorreoToken` opcional); la respuesta agrega `esCorreoVerificado`; `422 REGISTRATION_TYPE_NOT_AVAILABLE` si el tipo no corresponde a la persona (spec 016 del backend) |
| `POST /student-verification` | JSON `{ correo, tipoDocumento, numeroDocumento }` |
| `POST /google-verification` | JSON `{ idToken }` (ver abajo) |
| `GET /document-lookup/dni/:numero` | `404 DOCUMENT_NOT_FOUND`, `503 LOOKUP_UNAVAILABLE`, `429` |
| `GET /payment-qr/:archivo` | Imagen del QR de una billetera (`qrArchivo`), solo del evento del token (spec 012 del backend) |
| `POST /papers` | multipart: `data` JSON + `file` PDF |
| `POST /contact` | JSON `{ nombres, apellidos, correo, asunto, mensaje }` |

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
| `GET /api/publico/planes?categoria=ESTUDIANTES\|PUBLICO_GENERAL` | `GET /registration-types` | 60 s por categoría (lista blanca) | — |
| `GET /api/publico/catalogos` | `GET /catalogs` | 10 min, clave constante | — |
| `GET /api/publico/configuracion` | `GET /config` | 60 s, clave constante | — |
| `GET /api/publico/consulta-dni/:numero` | `GET /document-lookup/dni/:numero` | no (`no-store`) | — |
| `GET /api/publico/qr/:archivo` | `GET /payment-qr/:archivo` | `public, max-age=86400, immutable` (navegador/CDN) | — |
| `POST /api/publico/verificacion-estudiante` | `POST /student-verification` | no | JSON, 100 KB |
| `POST /api/publico/verificacion-google` | `POST /google-verification` | no | JSON, 8 KB |
| `POST /api/publico/inscripciones` | `POST /inscriptions` | no | multipart, 5 MB + 512 KB |
| `POST /api/publico/ponencias` | `POST /papers` | no | multipart, 5 MB + 512 KB |
| `POST /api/publico/contacto` | `POST /contact` | no | JSON, 100 KB |

Reglas comunes:

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
