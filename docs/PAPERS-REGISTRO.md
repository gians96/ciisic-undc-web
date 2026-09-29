# Registro de papers

La página `/papers/registro`, accesible desde el botón Registrar paper de `/papers`, envía el formulario a la ruta BFF de la landing `POST /api/publico/ponencias`. Nitro lo reenvía tal cual a `POST {NUXT_BACKEND_BASE_URL}/api/v1/site/papers` con el token del evento (`X-Api-Key`) y la IP del visitante (`X-Client-Ip`), igual que las inscripciones. No depende de EasyChair.

## Puesta en marcha

El backend (`backend-ciisic`) incluye el módulo `src/api/papers` y guarda las ponencias asociadas al evento del token.

1. En el backend, generar Prisma y compilar: `npm run build`.
2. Aplicar las migraciones pendientes en la base de datos correspondiente: `npx prisma migrate deploy`. Revisar primero `npx prisma migrate status`.
3. Mantener persistente el volumen `UPLOADS_DIR`. Los PDF se guardan en su subcarpeta `papers`; no debe publicarse como carpeta estática.
4. Configurar en la landing `NUXT_BACKEND_BASE_URL` y `NUXT_BACKEND_EVENT_TOKEN` (runtime).
5. Configurar el proxy con un límite mayor de 5 MB para permitir el multipart (por ejemplo, 6 MB). El BFF acepta hasta 5 MB + 512 KB y responde `413 UPLOAD_LIMIT_EXCEEDED` por encima.

## Contrato

- Landing → Nitro: `POST /api/publico/ponencias`, `multipart/form-data`, con `data` (JSON con `title`, `mainAuthor` y `coauthors`) y `file` (PDF). Contrato del BFF en `specs/001-landing-multi-evento/contracts/bff-landing.md`.
- Nitro → backend: `POST /api/v1/site/papers` (mismo cuerpo).
- Cada autor contiene `firstName`, `lastName`, `university`. Se permite un autor principal y entre cero y tres coautores.
- Título: hasta 300 caracteres; nombres y apellidos: hasta 120 cada uno; universidad: hasta 200.
- PDF: hasta 5 MiB, extensión y MIME PDF, cabecera PDF y marcador de fin. Esto no sustituye un análisis antivirus ni una validación estructural completa del documento.
- Respuesta `201`: `{ success: true, data: { id, creadoEn } }`. El identificador es el código de recepción; no implica aceptación académica.
- Los listados y la descarga de PDF son administrativos (panel), no públicos.

No se envían correos ni se migran automáticamente los trabajos a EasyChair. Los archivos y la base de datos deben respaldarse juntos. Si una carga falla, el formulario conserva los datos y no muestra una recepción exitosa.

## Verificación

- Web: `bun run test`, `bun run lint`, `bun run typecheck` y `bun run build`.
- Backend: `npx jest tests/papers/index.ts --runInBand` y `npx tsc --noEmit`.
- Las pruebas del backend usan Prisma simulado y archivos temporales, sin conectarse a la base real.
