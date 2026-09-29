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
  solo si `esEstudianteUndc === true`.

### 2. Composable `useInscription` (`app/composables/useInscription.ts`)

- `mapFormDataToApiData()`: valores del formulario → datos del contrato (sin montos, descuentos ni estados).
- `createInscription()`: `POST /api/publico/inscripciones` (multipart: `participante` JSON + campos + archivo
  `voucher`) y guarda la respuesta en el store.

### 3. BFF (`server/api/publico/inscripciones.post.ts`)

- Reenvía el cuerpo tal cual a `POST {NUXT_BACKEND_BASE_URL}/api/v1/site/inscriptions` con `X-Api-Key` y
  `X-Client-Ip`; límite de 5 MB + 512 KB (`413`); propaga estado y cuerpo del backend.

### 4. Store de inscripción (`app/stores/inscription.ts`)

- `currentInscription`: respuesta del POST (tipada como `InscripcionCreada`), solo en memoria.

### 5. Página de confirmación (`app/pages/confirmation.vue`)

- Lee el store (no hay GET público de inscripciones) y muestra monto, precio regular, descuento
  ("Precio UNDC aplicado"), datos del pago, estado y el contacto del evento.
- Si no hay datos en el store (recarga o enlace directo), muestra el aviso de sesión expirada.

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
