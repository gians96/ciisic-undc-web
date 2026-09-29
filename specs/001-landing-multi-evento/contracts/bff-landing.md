# Contrato — BFF de la landing (`server/api/publico/*`)

Este repositorio es dueño **solo** de estas rutas (navegador → Nitro, mismo origen). Nitro las
reenvía a la API del sitio de `backend-ciisic` agregando el token del evento.

## API del sitio consumida (backend-ciisic)

> Fuente de verdad: `backend-ciisic/specs/007-tokens-acceso-evento/contracts/api-sitio.md`
> (formas de datos, códigos de error y límites por visitante) y, para `/config` y
> `/google-verification`, la spec 010 del backend (acceso con Google; resumen provisional abajo
> hasta que publique su contrato). Resumen:

- Base `${NUXT_BACKEND_BASE_URL}/api/v1/site`, sin `:codigo` (el evento lo define el token).
- Encabezados: `X-Api-Key: <token del evento>` (obligatorio), `X-Client-Ip: <IP del visitante>`
  (recomendado; el backend lo usa para el límite por visitante solo si el token es válido).
- El backend no admite `X-Api-Key` desde navegadores (CORS): toda llamada pasa por Nitro.
- Errores propios del token: `401 EVENT_TOKEN_REQUIRED`, `401 INVALID_EVENT_TOKEN` (revocado,
  expirado o inexistente), `404 EVENT_NOT_FOUND` (evento archivado).

| Backend | Uso |
|---|---|
| `GET /event` | Evento público (forma `EventoPublico`) |
| `GET /registration-types?categoria=` | Categorías y tipos activos |
| `GET /catalogs` | `{ clasificaciones: [{ id, nombre }], tiposDocumento: [{ id, nombre, abreviatura }] }` |
| `GET /config` | `{ google: { clientId: string \| null }, urlPanel: string \| null }` |
| `POST /inscriptions` | multipart: `participante` JSON + campos + `voucher` (+ `verificacionCorreoToken` opcional); la respuesta agrega `esCorreoVerificado` |
| `POST /student-verification` | JSON `{ correo, tipoDocumento, numeroDocumento }` |
| `POST /google-verification` | JSON `{ idToken }` (ver abajo) |
| `GET /document-lookup/dni/:numero` | `404 DOCUMENT_NOT_FOUND`, `503 LOOKUP_UNAVAILABLE`, `429` |
| `POST /papers` | multipart: `data` JSON + `file` PDF |
| `POST /contact` | JSON `{ nombres, apellidos, correo, asunto, mensaje }` |

### Verificación del correo con Google (spec 010 del backend, resumen)

- `POST /google-verification` con `{ idToken }` (ID token de Google Identity Services, ≤ 4096
  caracteres, `header.payload.firma`) →
  `{ success: true, data: { correo, nombres: string | null, apellidos: string | null, tipoCuenta: 'ESTUDIANTE' | 'PERSONAL' | 'EXTERNO', esInstitucional: boolean, verificacionCorreoToken } }`.
- `tipoCuenta` (regla fija del backend): dominio `undc.edu.pe` con parte local numérica de 8 a 12
  dígitos = `ESTUDIANTE`; otra parte local del dominio = `PERSONAL`; otro dominio = `EXTERNO`.
- `verificacionCorreoToken`: 24 h, atado al evento y al correo. `POST /inscriptions` lo acepta como
  campo opcional; si no es válido o es de otro correo se ignora (`esCorreoVerificado: false`). No
  cambia el precio.
- Errores: `503 GOOGLE_NOT_CONFIGURED`, `503 GOOGLE_UNAVAILABLE`, `401 INVALID_GOOGLE_TOKEN`,
  `403 GOOGLE_EMAIL_NOT_VERIFIED`, `403 GOOGLE_NOT_AUTHORITATIVE` (la cuenta no es de Gmail ni de un
  dominio de Google Workspace), `422 VALIDATION_ERROR`, `429 RATE_LIMITED` y los comunes del sitio
  (`401 EVENT_TOKEN_REQUIRED`, `401 INVALID_EVENT_TOKEN`).

## Rutas del BFF

| Ruta (landing) | Backend | Caché | Límite de cuerpo |
|---|---|---|---|
| `GET /api/publico/evento` | `GET /event` | 60 s, clave constante | — |
| `GET /api/publico/planes?categoria=ESTUDIANTES\|PUBLICO_GENERAL` | `GET /registration-types` | 60 s por categoría (lista blanca) | — |
| `GET /api/publico/catalogos` | `GET /catalogs` | 10 min, clave constante | — |
| `GET /api/publico/configuracion` | `GET /config` | 60 s, clave constante | — |
| `GET /api/publico/consulta-dni/:numero` | `GET /document-lookup/dni/:numero` | no (`no-store`) | — |
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
