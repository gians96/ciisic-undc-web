# Despliegue seguro del Hito 1

## Ramas y servicios

| Entorno | Frontend | Backend | Base de datos | Archivos |
| --- | --- | --- | --- | --- |
| Staging | rama `staging`, app `frontend-ciisic-vii-staging` | rama `staging`, app `backend-ciisic-vii-staging` | MySQL exclusivo | volumen exclusivo montado en `/app/uploads` |
| Producción | rama `rama-beni`, app `frontend-ciisic-vii` | rama `main`, app `backend-ciisic-vii` | MySQL productivo | volumen productivo montado en `/app/uploads` |

Los servicios de staging deben utilizar dominios distintos y protección de acceso. Nunca deben compartir `DATABASE_URL`, volumen ni credenciales de bootstrap con producción.

## Variables de Dokploy

Backend (`backend-ciisic`, detalle en su `docs/configuracion.md`): solo `DATABASE_URL` y
`JWT_SECRET` (≥ 32 caracteres aleatorios; de él se deriva la clave que cifra las credenciales
guardadas, así que rotarlo obliga a volver a guardarlas en el panel). `NODE_ENV=production` lo
fija la imagen. API_UNDC, Google, URL del panel, correo (Brevo),
tokens DNI y rutas de la landing anterior se configuran en el panel; CORS está abierto y lo
protege el token. Variables antiguas (`CORS_ORIGINS`, `API_URL`, `UPLOADS_DIR`, `RENIEC_*`,
`NUBETEC_TOKEN`, `BREVO_*`, `BOOTSTRAP_*`, `SECRETS_ENCRYPTION_KEY`…) sobran: el log del backend avisa de cada una.

Frontend (landing, BFF de la API del sitio):

- `NODE_ENV=production`
- `NUXT_BACKEND_BASE_URL`, URL del backend del mismo entorno alcanzable por Nitro (la landing llama a `{URL}/api/v1/site`)
- `NUXT_BACKEND_EVENT_TOKEN`, token de acceso del evento (se genera en el panel del backend). **Secreto**: solo como variable runtime; nunca `NUXT_PUBLIC_*`, argumento del build ni GitHub

No hay más variables: la URL del panel (a la que redirige `/login`) y el client ID de Google (botón «Continuar con Google» de la inscripción) se configuran en el backend y la landing los lee de `/api/publico/configuracion` (backend `GET /api/v1/site/config`, caché de 60 s). Sin client ID el botón no aparece; sin URL, `/login` muestra un aviso.

Google: el dominio de cada landing (y `http://localhost:3000` en desarrollo) debe figurar en «Orígenes de JavaScript autorizados» del client ID en Google Cloud; si no, la ventana de Google muestra un error y la inscripción sigue funcionando sin verificar el correo. La landing no envía `Cross-Origin-Opener-Policy`; si se agrega, debe ser `same-origin-allow-popups`.

El navegador nunca llama al backend: todas las llamadas pasan por las rutas Nitro `/api/publico/*`, que agregan `X-Api-Key` y `X-Client-Ip` (última IP de `X-Forwarded-For`, que agrega Traefik). Sin token o sin URL, esas rutas responden `503 SITE_NOT_CONFIGURED` y lo registran en los logs del contenedor. Cambiar de edición o rotar el token requiere reiniciar el servicio.

Los secretos se configuran como variables runtime de Dokploy. No se envían como argumentos del build ni se guardan en GitHub.

## Preparación

1. Habilitar reglas de protección en `rama-beni`, `main` y ambas ramas `staging`: PR obligatorio y workflow CI requerido.
2. Crear los servicios y recursos aislados de staging.
3. Montar y verificar el volumen de uploads antes del primer despliegue.
4. Las migraciones se aplican solas al arrancar el contenedor del backend (valida el entorno y
   luego ejecuta `prisma migrate deploy`).
5. Crear el primer SuperAdmin una sola vez en el contenedor backend:
   `node dist/src/database/bootstrapAdmin.js --correo admin@undc.edu.pe` (muestra una contraseña temporal).

## Validación de staging

1. Comprobar `/health` en frontend y backend, y que `/api/publico/evento` del frontend responde `200` (sin `SITE_NOT_CONFIGURED`).
2. Cargar planes y catálogos desde el frontend.
3. Consultar un documento de prueba autorizado.
4. Crear una inscripción con PNG/PDF válido y comprobar rechazo de formato falso, archivo mayor a 5 MiB y operación duplicada.
   Repetirla con «Continuar con Google»: el correo queda fijado, la confirmación dice «Verificado con Google» y su enlace abre `/mis-inscripciones` del panel.
5. En el panel administrativo (`/login` de la landing redirige ahí): iniciar sesión; comprobar cookie HttpOnly y que el JWT no aparece en almacenamiento local.
6. Verificar `401` sin sesión, `403` de Admin en rutas SuperAdmin y descarga autenticada de voucher.
7. Aprobar la inscripción y verificar el correo con la credencial PDF adjunta.
8. Redesplegar backend y confirmar que inscripción y voucher persisten.

## Producción y rollback

1. Registrar los commits actualmente desplegados y crear tags de respaldo.
2. Crear backups verificables de MySQL y del volumen `/app/uploads`.
3. Fusionar y desplegar backend; comprobar health, catálogos, login y permisos.
4. Fusionar y desplegar frontend; ejecutar una inscripción controlada completa.
5. Ante una falla, redesplegar el tag anterior del servicio afectado. Este hito no contiene migraciones destructivas.

