# Registro temporal de papers

La página `/papers/registro`, accesible desde el botón Registrar paper de `/papers`, envía el formulario al backend configurado en `NUXT_PUBLIC_API_BASE_URL`, igual que las inscripciones. No depende de EasyChair.

## Puesta en marcha

El backend `backend-ciisic-vii` incluye el módulo `src/api/papers`, el modelo `PaperSubmission` y la migración `20260928000000_paper_submissions`.

1. En el backend, generar Prisma y compilar: `npm run build`.
2. Aplicar las migraciones pendientes en la base de datos correspondiente: `npx prisma migrate deploy`. Revisar primero `npx prisma migrate status`.
3. Mantener persistente el volumen `UPLOADS_DIR`. Los PDF se guardan en su subcarpeta `papers`; no debe publicarse como carpeta estática.
4. Desplegar el backend antes de habilitar esta versión de la web y permitir su origen en `CORS_ORIGINS`.
5. Configurar el proxy con un límite mayor de 5 MB para permitir el multipart (por ejemplo, 6 MB).

La migración se entrega en código; no se aplica automáticamente sobre una base existente.

## Contrato

- `POST /api/v1/papers`: público, `multipart/form-data`, con `data` (JSON con `title`, `mainAuthor` y `coauthors`) y `file` (PDF).
- Cada autor contiene `firstName`, `lastName`, `university`. Se permite un autor principal y entre cero y tres coautores.
- Título: hasta 300 caracteres; nombres y apellidos: hasta 120 cada uno; universidad: hasta 200.
- PDF: hasta 5 MiB, extensión y MIME PDF, cabecera PDF y marcador de fin. Esto no sustituye un análisis antivirus ni una validación estructural completa del documento.
- Respuesta `201`: `{ success: true, data: { id, createdAt } }`. El identificador es el código de recepción; no implica aceptación académica.
- `GET /api/v1/papers?page=1`: listado administrativo, 50 resultados por página, token Bearer con rol 1 o 2.
- `GET /api/v1/papers/:id/file`: descarga administrativa del PDF con los mismos permisos. No existe descarga pública ni panel administrativo nuevo.

No se envían correos ni se migran automáticamente los trabajos a EasyChair. Los archivos y la base de datos deben respaldarse juntos. Si una carga falla, el formulario conserva los datos y no muestra una recepción exitosa.

## Verificación

- Web: `npm test` y ESLint sobre los archivos modificados.
- Backend: `npx jest tests/papers/index.ts --runInBand` y `npx tsc --noEmit`.
- Las pruebas del backend usan Prisma simulado y archivos temporales, sin conectarse a la base real.
