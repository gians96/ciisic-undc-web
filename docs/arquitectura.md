# Arquitectura

## Principio: el navegador nunca llama al backend

```
Navegador ──► landing (Nuxt SSR + Nitro) ──X-Api-Key (token del evento) + X-Client-Ip──► backend-ciisic /api/v1/site/*
              /api/publico/*  (BFF)
```

- El **token de acceso del evento** (`NUXT_BACKEND_EVENT_TOKEN`) solo existe en el servidor
  Nitro (runtime config privada). Define el evento: la landing no conoce ningún código de evento.
- Todas las llamadas del navegador van a rutas propias `server/api/publico/*`; la lógica común
  está en `server/utils/api-sitio.ts` (llamada, errores, IP del visitante) y
  `server/utils/sitio.ts` (reenvío de cuerpos JSON y multipart con límites de tamaño).
- `X-Client-Ip` = última IP de `X-Forwarded-For` (la agrega Traefik) o la del socket: el backend
  la usa para los límites por visitante.
- El backend responde errores con `code`; el BFF los devuelve sin cambios y la UI los traduce
  (`app/utils/errores-api.ts`).

## Rutas del BFF

| Ruta Nitro | Backend | Caché |
|---|---|---|
| `GET /api/publico/evento` | `GET /site/event` | 60 s |
| `GET /api/publico/planes?categoria=` | `GET /site/registration-types` (cada tipo trae `modalidad`: asistencia `PRESENCIAL` \| `VIRTUAL`, aditivo) | 60 s |
| `GET /api/publico/catalogos` | `GET /site/catalogs` | 10 min |
| `GET /api/publico/configuracion` | `GET /site/config` (client ID de Google, URL del panel) | 60 s |
| `GET /api/publico/consulta-dni/:numero` | `GET /site/document-lookup/dni/:numero` | no |
| `GET /api/publico/qr/:archivo` (imagen) | `GET /site/payment-qr/:archivo` (QR subido en el panel) | navegador/CDN 1 día (`immutable`) |
| `GET /api/publico/credencial/:codigo` | `GET /site/credential/:codigo` (credencial 3D del enlace del correo, spec 038 del backend) | no |
| `POST /api/publico/credencial/:codigo/tecnologias` | `POST /site/credential/:codigo/technologies` (tecnologías elegidas) | no |
| `POST /api/publico/verificacion-estudiante` | `POST /site/student-verification` | no |
| `POST /api/publico/verificacion-google` | `POST /site/google-verification` (`credential` → `idToken`) | no |
| `POST /api/publico/inscripciones` (multipart) | `POST /site/inscriptions` | no |
| `POST /api/publico/ponencias` (multipart) | `POST /site/papers` | no |
| `POST /api/publico/contacto` | `POST /site/contact` | no |
| `GET /api/publico/ponencias-especializadas` | `GET /site/specialized-talks` (ponencias publicadas con `cuposDisponibles`) | 15 s |
| `POST /api/publico/ponencias-especializadas/inscripciones` | `POST /site/specialized-talk-registrations` (JSON `{ asistente, ponenciaIds }`, todo o nada) | no |
| `POST /api/publico/ponencias-especializadas/elegibilidad` | `POST /site/specialized-talk-eligibility` (documento + correo del congreso → modo presencial o virtual) | no |
| `GET /api/publico/delegaciones/:codigo` | `GET /site/delegations/link/:codigo` (grupo, planes, integrantes con su plan y vouchers enmascarados) | no |
| `GET /api/publico/delegaciones/unirse/:codigo` | `GET /site/delegations/join/:codigo` (el link individual: grupo, dominio del correo y planes activos) | no |
| `POST /api/publico/delegaciones/unirse/:codigo/participante` | `POST /site/delegations/join/:codigo/participants` (JSON, una persona: `correoPrefijo` o `correo`, y `plan`; sin Google) | no |
| `POST /api/publico/delegaciones/:codigo/integrantes` | `POST /site/delegations/link/:codigo/participants` (JSON `{ participantes }`) | no |
| `POST /api/publico/delegaciones/:codigo/pagos` | `POST /site/delegations/link/:codigo/payments` (multipart `pagos` y `vouchers`) | no |

Los errores nunca se guardan en caché. Sin token o sin URL del backend: `503 SITE_NOT_CONFIGURED`.

## Inscripción del Encuentro de Egresados

La página solo presenta el estado de
apertura y, cuando está autorizado, abre el URL público de respuesta de Google Forms en otra pestaña.
La landing no recibe ni persiste datos personales. Google Forms almacena sus respuestas en la hoja
institucional vinculada. Consulta [INSCRIPCION-EGRESADOS.md](INSCRIPCION-EGRESADOS.md).

## Inscripción

`useFormularioInscripcion` (compartido por `/estudiantes`, `/general` y `/fi-undc`):
1. Planes, datos de pago y ciclos desde el backend (estados de carga, error e "inscripciones cerradas").
   Los planes se agrupan por **modalidad de asistencia** (Presencial, luego Virtual; sin encabezados si solo
   hay una) con funciones puras de `app/utils/planes.ts`; `/planes` anuncia la oferta virtual con
   `useOfertaVirtual` solo si la API devuelve planes virtuales. «Modalidad» de asistencia no es `ModalidadPago`
   ni las tarjetas «Modalidad 0N» de `/planes` (categorías).
2. Consulta DNI (RENIEC vía pool del backend); si no hay servicio, nombres a mano.
3. **Google (opcional)**: `CorreoGoogle.vue` → Google Identity Services (popup) → BFF → backend
   verifica el ID token y devuelve un `verificacionCorreoToken`; el correo queda fijo y los
   nombres vacíos se completan. "Usar otro correo" lo descarta. No cambia precios.
4. Verificación de estudiante UNDC (SIVIRENO vía backend) con el correo: el token resultante
   habilita el precio UNDC.
5. Envío multipart con el voucher y los tokens; la confirmación muestra monto, estado y el enlace
   "Ver el estado de mi inscripción" al portal del panel (`${urlPanel}/mis-inscripciones`).

## Configuración que viene del backend

El client ID de Google y la URL del panel se configuran en el panel → Sistema y la landing los
lee de `/api/publico/configuracion`. Sin client ID no aparece el botón de Google; sin URL,
`/login` muestra un aviso en lugar de redirigir.
