# Flujo de Inscripción y Confirmación

## Descripción

Las inscripciones se envían a la API del sitio de `backend-ciisic` a través del BFF de la landing:
el navegador nunca llama al backend y el token del evento solo existe en el servidor Nitro.
Spec y contratos: `specs/001-landing-multi-evento/` (`spec.md`, `plan.md`, `contracts/bff-landing.md`).

## Arquitectura

### 1. Páginas `/estudiantes` y `/general`

- Conservan su template y estilos; la lógica común vive en `useFormularioInscripcion({ categoria, verificarEstudiante })`.
- Datos del evento (`useEvento` → `/api/publico/evento`), planes (`usePlanes` → `/api/publico/planes?categoria=`)
  y ciclos (`useCatalogos` → `/api/publico/catalogos`), cargados con `useAsyncData` (compatibles con SSR).
- Muestran "Inscripciones cerradas", "Cargando" o un error con "Reintentar" según el estado del evento.
- `/estudiantes` verifica al estudiante UNDC (`/api/publico/verificacion-estudiante`) y muestra el precio UNDC
  solo si `esEstudianteUndc === true`. En `/general` el precio UNDC depende del dominio del correo.
- Con esa misma condición se ocultan los planes que no corresponden (`disponiblePara`, spec 016 del
  backend; `planDisponible` en `app/utils/planes.ts`): un plan «solo externos» no se muestra con correo
  `@undc.edu.pe` (o a un estudiante verificado) y uno «solo comunidad UNDC» solo aparece con esa condición.
  Un aviso explica por qué faltan planes y, si el plan elegido deja de ofrecerse, se limpia la selección
  (salvo durante una verificación en curso). Si el backend lo rechaza igual (p. ej. el DNI ya estaba
  registrado con un correo UNDC), responde `REGISTRATION_TYPE_NOT_AVAILABLE` y se vuelve a elegir el plan.
  Detalles en `specs/003-disponibilidad-planes/`.
- Junto al correo, ambas páginas ofrecen «Continuar con Google» (opcional, `InscripcionCorreoGoogle`) si la
  configuración del sitio (`/api/publico/configuracion`) trae client ID. La credencial de Google va a
  `/api/publico/verificacion-google`; al verificarse, el correo queda fijado y de solo lectura, los nombres
  vacíos (que no vinieron del DNI) se completan y el `verificacionCorreoToken` (solo en memoria) viaja con la
  inscripción. «Usar otro correo» lo descarta. Google no cambia el precio: los estudiantes siguen
  verificándose con SIVIRENO. Detalles en `specs/002-google-en-inscripcion/`.

### 2. Composable `useInscription` (`app/composables/useInscription.ts`)

- `mapFormDataToApiData()`: valores del formulario → datos del contrato (sin montos, descuentos ni estados).
- `createInscription()`: `POST /api/publico/inscripciones` (multipart: `participante` JSON + campos + archivo
  `voucher`, y `verificacionCorreoToken` solo si el correo sigue verificado con Google) y guarda la respuesta
  en el store.

### 3. BFF (`server/api/publico/inscripciones.post.ts`)

- Reenvía el cuerpo tal cual a `POST {NUXT_BACKEND_BASE_URL}/api/v1/site/inscriptions` con `X-Api-Key` y
  `X-Client-Ip`; límite de 5 MB + 512 KB (`413`); propaga estado y cuerpo del backend.

### 4. Store de inscripción (`app/stores/inscription.ts`)

- `currentInscription`: respuesta del POST (tipada como `InscripcionCreada`), solo en memoria.

### 5. Página de confirmación (`app/pages/confirmation.vue`)

- Lee el store (no hay GET público de inscripciones) y muestra monto, precio regular, descuento
  ("Precio UNDC aplicado"), «Verificado con Google» (`esCorreoVerificado`), datos del pago, estado y el
  contacto del evento.
- Si la configuración del sitio trae `urlPanel`, enlaza a `<urlPanel>/mis-inscripciones` («Ver el estado de mi
  inscripción», en otra pestaña), donde el participante ingresa con la cuenta de Google de su correo.
- Si no hay datos en el store (recarga o enlace directo), muestra el aviso de sesión expirada (con el mismo
  enlace al panel).

## Flujo Completo

1. El usuario completa el formulario en `/estudiantes` o `/general`.
2. El navegador envía `POST /api/publico/inscripciones` (mismo origen).
3. Nitro lo reenvía a `POST /api/v1/site/inscriptions` con el token del evento.
4. El backend calcula el monto y responde `201` con la inscripción creada.
5. `useInscription` guarda la respuesta en el store y se redirige a `/confirmation?id=<id>`.
6. `/confirmation` muestra los datos devueltos por el servidor.

Los errores del backend (`ALREADY_REGISTERED`, `VALIDATION_ERROR`, `REGISTRATION_CLOSED`, …) y del BFF
(`SITE_NOT_CONFIGURED`, `BACKEND_UNAVAILABLE`, …) se muestran con mensajes en español
(`app/utils/errores-api.ts`); el formulario conserva los datos.

## Limitaciones

- **Recarga de página**: si el usuario recarga `/confirmation`, pierde los datos del store y ve el aviso de
  sesión expirada con el contacto del evento.
- **Enlace directo**: `/confirmation?id=X` sin datos en memoria muestra el mismo aviso.

## Testing

```bash
bun run test        # helpers del cliente y del BFF (fetch simulado)
bun run typecheck
bun run lint
bun run build
```

Prueba manual: con el backend y un token de prueba (`NUXT_BACKEND_BASE_URL`, `NUXT_BACKEND_EVENT_TOKEN`),
completar `/general` con un DNI nuevo y un voucher PNG y verificar que `/confirmation` muestre la respuesta.
