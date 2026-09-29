# Despliegue seguro del Hito 1

## Ramas y servicios

| Entorno | Frontend | Backend | Base de datos | Archivos |
| --- | --- | --- | --- | --- |
| Staging | rama `staging`, app `frontend-ciisic-vii-staging` | rama `staging`, app `backend-ciisic-vii-staging` | MySQL exclusivo | volumen exclusivo montado en `/app/uploads` |
| Producción | rama `rama-beni`, app `frontend-ciisic-vii` | rama `main`, app `backend-ciisic-vii` | MySQL productivo | volumen productivo montado en `/app/uploads` |

Los servicios de staging deben utilizar dominios distintos y protección de acceso. Nunca deben compartir `DATABASE_URL`, volumen ni credenciales de bootstrap con producción.

## Variables de Dokploy

Backend:

- `NODE_ENV=production`
- `PORT=3000`
- `DATABASE_URL`
- `JWT_SECRET` aleatorio de al menos 32 caracteres
- `CORS_ORIGINS`, lista separada por comas con los dominios frontend permitidos
- `API_URL`, URL pública del backend
- `UPLOADS_DIR=/app/uploads`
- `MAX_UPLOAD_BYTES=5242880`
- `RENIEC_PROVIDER=nubetec` y `NUBETEC_TOKEN`; alternativamente `reniec`, `RENIEC_TOKEN` y `API_RENIEC_DNI`
- `BREVO_API_KEY`, `BREVO_SENDER`, `BREVO_SENDER_NAME` y `BREVO_SENDER_SUBJECT`
- `BOOTSTRAP_ADMIN_EMAIL` y `BOOTSTRAP_ADMIN_PASSWORD` solo durante la creación inicial

Frontend (landing, BFF de la API del sitio):

- `NODE_ENV=production`
- `NUXT_BACKEND_BASE_URL`, URL del backend del mismo entorno alcanzable por Nitro (la landing llama a `{URL}/api/v1/site`)
- `NUXT_BACKEND_EVENT_TOKEN`, token de acceso del evento (se genera en el panel del backend). **Secreto**: solo como variable runtime; nunca `NUXT_PUBLIC_*`, argumento del build ni GitHub

No hay más variables: la URL del panel (a la que redirige `/login`) y el client ID de Google (botón «Continuar con Google» de la inscripción) se configuran en el backend y la landing los lee de `/api/publico/configuracion` (backend `GET /api/v1/site/config`, caché de 60 s). Sin client ID el botón no aparece; sin URL, `/login` muestra un aviso.

El navegador nunca llama al backend: todas las llamadas pasan por las rutas Nitro `/api/publico/*`, que agregan `X-Api-Key` y `X-Client-Ip` (última IP de `X-Forwarded-For`, que agrega Traefik). Sin token o sin URL, esas rutas responden `503 SITE_NOT_CONFIGURED` y lo registran en los logs del contenedor. Cambiar de edición o rotar el token requiere reiniciar el servicio.

Los secretos se configuran como variables runtime de Dokploy. No se envían como argumentos del build ni se guardan en GitHub.

## Preparación

1. Habilitar reglas de protección en `rama-beni`, `main` y ambas ramas `staging`: PR obligatorio y workflow CI requerido.
2. Crear los servicios y recursos aislados de staging.
3. Montar y verificar el volumen de uploads antes del primer despliegue.
4. Ejecutar `prisma migrate deploy` contra la base de staging.
5. Ejecutar una sola vez `npm run bootstrap:admin` en el contenedor backend; retirar después las variables `BOOTSTRAP_ADMIN_*`.

## Validación de staging

1. Comprobar `/health` en frontend y backend, y que `/api/publico/evento` del frontend responde `200` (sin `SITE_NOT_CONFIGURED`).
2. Cargar planes y catálogos desde el frontend.
3. Consultar un documento de prueba autorizado.
4. Crear una inscripción con PNG/PDF válido y comprobar rechazo de formato falso, archivo mayor a 5 MiB y operación duplicada.
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

