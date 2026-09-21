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

Frontend:

- `NODE_ENV=production`
- `NUXT_PUBLIC_API_BASE_URL`, URL pública del backend del mismo entorno
- `NUXT_BACKEND_BASE_URL`, URL alcanzable por Nitro hacia el backend del mismo entorno
- `NUXT_X_API_TOKEN` y `NUXT_X_API_URL` para la consulta de documentos

Los secretos se configuran como variables runtime de Dokploy. No se envían como argumentos del build ni se guardan en GitHub.

## Preparación

1. Habilitar reglas de protección en `rama-beni`, `main` y ambas ramas `staging`: PR obligatorio y workflow CI requerido.
2. Crear los servicios y recursos aislados de staging.
3. Montar y verificar el volumen de uploads antes del primer despliegue.
4. Ejecutar `prisma migrate deploy` contra la base de staging.
5. Ejecutar una sola vez `npm run bootstrap:admin` en el contenedor backend; retirar después las variables `BOOTSTRAP_ADMIN_*`.

## Validación de staging

1. Comprobar `/health` en frontend y backend.
2. Cargar planes y catálogos desde el frontend.
3. Consultar un documento de prueba autorizado.
4. Crear una inscripción con PNG/PDF válido y comprobar rechazo de formato falso, archivo mayor a 5 MiB y operación duplicada.
5. Iniciar sesión; comprobar cookie HttpOnly y que el JWT no aparece en almacenamiento local.
6. Verificar `401` sin sesión, `403` de Admin en rutas SuperAdmin y descarga autenticada de voucher.
7. Aprobar la inscripción y verificar el correo con la credencial PDF adjunta.
8. Redesplegar backend y confirmar que inscripción y voucher persisten.

## Producción y rollback

1. Registrar los commits actualmente desplegados y crear tags de respaldo.
2. Crear backups verificables de MySQL y del volumen `/app/uploads`.
3. Fusionar y desplegar backend; comprobar health, catálogos, login y permisos.
4. Fusionar y desplegar frontend; ejecutar una inscripción controlada completa.
5. Ante una falla, redesplegar el tag anterior del servicio afectado. Este hito no contiene migraciones destructivas.

