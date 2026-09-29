# Contrato — BFF de la landing (`server/api/publico/*`)

Este repositorio es dueño **solo** de estas rutas (navegador → Nitro, mismo origen). Nitro las
reenvía a la API del sitio de `backend-ciisic` agregando el token del evento.

## API del sitio consumida (backend-ciisic)

> Fuente de verdad: `backend-ciisic`. Resumen del contrato comunicado el 2026-09-29, **provisional**
> hasta que el backend publique su archivo de contrato; entonces este apartado se reemplaza por la
> referencia. Formas de datos y códigos de error: iguales a
> `backend-ciisic/specs/002-multi-evento/contracts/api-publica.md`,
> `003-consultas-dni/contracts/api-consultas.md` y `004-verificacion-estudiante/contracts/api-verificacion.md`.

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
| `POST /inscriptions` | multipart: `participante` JSON + campos + `voucher` |
| `POST /student-verification` | JSON `{ correo, tipoDocumento, numeroDocumento }` |
| `GET /document-lookup/dni/:numero` | `404 DOCUMENT_NOT_FOUND`, `503 LOOKUP_UNAVAILABLE`, `429` |
| `POST /papers` | multipart: `data` JSON + `file` PDF |
| `POST /contact` | JSON `{ nombres, apellidos, correo, asunto, mensaje }` |

## Rutas del BFF

| Ruta (landing) | Backend | Caché | Límite de cuerpo |
|---|---|---|---|
| `GET /api/publico/evento` | `GET /event` | 60 s, clave constante | — |
| `GET /api/publico/planes?categoria=ESTUDIANTES\|PUBLICO_GENERAL` | `GET /registration-types` | 60 s por categoría (lista blanca) | — |
| `GET /api/publico/catalogos` | `GET /catalogs` | 10 min, clave constante | — |
| `GET /api/publico/consulta-dni/:numero` | `GET /document-lookup/dni/:numero` | no (`no-store`) | — |
| `POST /api/publico/verificacion-estudiante` | `POST /student-verification` | no | JSON, 100 KB |
| `POST /api/publico/inscripciones` | `POST /inscriptions` | no | multipart, 5 MB + 512 KB |
| `POST /api/publico/ponencias` | `POST /papers` | no | multipart, 5 MB + 512 KB |
| `POST /api/publico/contacto` | `POST /contact` | no | JSON, 100 KB |

Reglas comunes:

- El cuerpo se reenvía tal cual (mismo `Content-Type`, incluido el `boundary` del multipart).
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
| 413 | `PAYLOAD_TOO_LARGE` | JSON mayor a 100 KB |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | `Content-Type` distinto de multipart o JSON según la ruta |
| 400 | `INVALID_CATEGORY` | `categoria` fuera de la lista blanca |
| 422 | `INVALID_DNI` | `:numero` no tiene 8 dígitos (no se consulta al backend) |
