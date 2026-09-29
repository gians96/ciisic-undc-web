# Implementation Plan: Verificación opcional del correo con Google y configuración desde la API

**Branch**: `feat/multi-evento-sdd` | **Date**: 2026-09-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-google-en-inscripcion/spec.md`

## Summary

La landing lee de la API del sitio lo que antes eran variables públicas (client ID de Google y URL
del panel) y agrega, junto al campo de correo de `/estudiantes` y `/general`, un botón opcional
«Continuar con Google» (Google Identity Services, ventana emergente). La credencial de Google pasa
por el BFF, que la reenvía como `{ idToken }` a `POST /google-verification`; el backend devuelve el
correo verificado, el tipo de cuenta y un `verificacionCorreoToken` que viaja con la inscripción
mientras el correo siga bloqueado. `/login` redirige al panel configurado y la confirmación enlaza
a `/mis-inscripciones` del panel. Las reglas de precio no cambian.

## Technical Context

**Language/Version**: TypeScript 5.9, Vue 3.5, Nuxt 4.5 (SSR, directorio `app/`), Nitro 2 / h3 1

**Primary Dependencies**: las de la feature 001; en el navegador, el script de Google Identity
Services (`https://accounts.google.com/gsi/client`) cargado bajo demanda. Sin paquetes npm nuevos.

**Storage**: caché en memoria de Nitro para `/config`; el `verificacionCorreoToken` solo en memoria
del formulario

**Testing**: Vitest 5 (happy-dom para `app/`, node para el BFF) con `fetch` y DOM simulados

**Target Platform**: Node 22 detrás de Traefik (Dokploy) y navegadores modernos

**Project Type**: aplicación web (frontend SSR + BFF que consume `backend-ciisic`)

**Constraints**: el client ID solo sirve en los orígenes autorizados en Google Cloud; la
credencial de Google (JWT) ocupa como máximo 4096 caracteres; límite por visitante del backend en
`/google-verification` (vía `X-Client-Ip`).

**Scale/Scope**: 2 rutas BFF, 3 composables, 1 componente (+ botón solo cliente), 5 páginas
(`/estudiantes`, `/general`, `/login`, `/confirmation`, `/privacidad`).

## Constitution Check

*GATE: revisado antes de implementar y al cerrar. Constitución 2.1.0 (enmendada en esta feature).*

| Principio | Estado | Cómo se cumple |
|---|---|---|
| I. Contrato del backend | ✅ | `/config`, `/google-verification` y `verificacionCorreoToken` según el contrato del backend (spec 010); el tipo de cuenta y el precio los decide el servidor; la landing solo muestra. |
| II. Token solo en el servidor | ✅ | El navegador llama solo a `/api/publico/*`; el BFF agrega `X-Api-Key`/`X-Client-Ip`. Sin variables `NUXT_PUBLIC_*`: client ID y URL del panel salen de `/config` (enmienda 2.1.0). El script de Google se carga solo en el cliente y la credencial y el token de verificación no se guardan. |
| III. Stack y diseño | ✅ | Sin paquetes nuevos; el bloque de Google reutiliza el estilo de los chips del formulario; marketing intacto. |
| IV. Accesibilidad | ✅ | Chip con `aria-live`, acción «Usar otro correo» como botón con foco visible que devuelve el foco al correo; botón de Google operable con teclado (iframe de Google); errores en español. |
| V. Calidad | ✅ | Reglas y mensajes en `app/utils/google.ts`, `google-identity.ts`, `configuracion-sitio.ts` y `server/utils/api-sitio.ts` con pruebas; puertas lint/typecheck/test/build. |

## Decisiones

- **D1 — Configuración desde la API.** `GET /api/publico/configuracion` es una lectura cacheada
  (60 s, clave `configuracion`) como el evento. En el cliente, `useConfiguracionSitio()` normaliza la
  respuesta en el handler de `useAsyncData` (el payload ya lleva los valores validados): `clientId`
  solo si termina en `.apps.googleusercontent.com`; `urlPanel` solo si es http(s) absoluta sin
  credenciales (se descartan consulta, fragmento y `/` final). Así un valor mal configurado equivale
  a «no configurado» y no hay redirecciones a esquemas peligrosos.
- **D2 — `/login` espera la configuración.** `await listo` (promesa de `useAsyncData`, que no se
  rechaza) antes de `navigateTo(urlPanel, { external: true, redirectCode: 302 })`: 302 en SSR y
  cambio de sitio en navegación cliente. Sin URL: aviso; con error de carga: «Reintentar».
- **D3 — BFF de verificación con adaptador.** `reenviarCuerpoSitio` recibe dos opciones nuevas:
  `limiteBytes` (8 KB para esta ruta) y `adaptar(cuerpo)`, que en esta ruta es
  `adaptarVerificacionGoogle`: parsea el JSON, valida `credential` (texto ≤ 4096 con 3 segmentos
  `[\w-]+`, la misma regla del backend) y produce `{ idToken }` como único campo. Si no es válida
  responde `422 INVALID_GOOGLE_CREDENTIAL` sin llamar al backend. El resto (IP, token, propagación
  de estado y cuerpo, `no-store`) es el camino común.
- **D4 — Núcleo de Google Identity Services sin Vue.** `app/utils/google-identity.ts` recibe el
  documento y la ventana (inyectados; en pruebas, dobles) y mantiene: una sola promesa de carga del
  script (`load`/`error`, sin sondeo; si falla se quita el `<script>` y se puede reintentar), un
  `initialize` por client ID cuyo callback delega en el receptor vigente (reemplazable), el dibujo
  del botón y `liberar()` (suelta el receptor si sigue siendo el suyo y llama a `cancel()`). El tipo
  `GoogleAccountsId` no declara `prompt()`: One Tap no se puede usar por accidente.
- **D5 — Solo cliente por construcción.** `InscripcionCorreoGoogle` (SSR) reserva 40 px con un
  marcador y monta dentro de `<ClientOnly>` el botón (`InscripcionBotonGoogle`), que es el único que
  llama a `useGoogleIdentity()`. El script de Google nunca se pide en el servidor ni en páginas sin
  formulario. El ancho se toma del contenedor (200–400 px) y se vuelve a dibujar si cambia (≥ 8 px
  respecto del ancho dibujado, con `ResizeObserver` y espera de 200 ms). Si el contenedor aún no
  tiene ancho al montarse (ocurre en la primera navegación cliente) se espera al observador; el
  marcador se mantiene hasta el primer dibujo.
- **D6 — Estado del correo en el formulario.** `useCorreoGoogle({ alVerificar })` vive dentro de
  `useFormularioInscripcion`: secuencia + `AbortController` para ignorar respuestas obsoletas;
  `alVerificar` fija `email` y completa nombres con `nombresDesdeGoogle` (cada campo solo si está
  vacío y los nombres no vinieron del DNI). `correoBloqueado = estado === 'verificado'`.
- **D7 — Token solo mientras el correo está bloqueado.** `tokenCorreoParaEnvio` exige correo
  bloqueado, token y que el correo del formulario sea el verificado (defensa ante cambios fuera de
  la interfaz). `construirFormDataInscripcion` agrega `verificacionCorreoToken` solo si hay token.
- **D8 — RENIEC manda.** La consulta de DNI sigue escribiendo nombres y apellidos cuando responde
  (aunque Google ya los haya completado); Google nunca toca nombres que vinieron del DNI.
- **D9 — Mensajes.** Tipo de cuenta en `app/utils/google.ts`; códigos de error en
  `mensajeErrorGoogle` (`app/utils/errores-api.ts`), donde los errores del sitio (token del evento,
  BFF, red) dicen que se puede seguir escribiendo el correo en lugar del genérico «servicio no
  disponible».
- **D10 — Enlace al panel en la confirmación.** Se abre en otra pestaña para no perder la
  confirmación (solo vive en memoria); también aparece en el aviso de sesión expirada, que es cuando
  más se necesita.
- **D11 — Sin bloqueo del envío.** Mientras la verificación con Google está en curso se pide
  esperar (como con SIVIRENO); un error de Google no bloquea el envío.

## Archivos

| Archivo | Cambio |
|---|---|
| `server/api/publico/configuracion.get.ts` (nuevo) | Lectura cacheada de `/config`. |
| `server/api/publico/verificacion-google.post.ts` (nuevo) | `{ credential }` → `{ idToken }` a `/google-verification`. |
| `server/utils/api-sitio.ts`, `server/utils/sitio.ts` | `adaptarVerificacionGoogle`, `esCredencialGoogle`; opciones `limiteBytes` y `adaptar`. |
| `app/utils/rutas-sitio.ts` | Rutas `configuracion` y `verificacionGoogle`. |
| `app/types/evento.ts`, `app/types/inscription.ts`, `app/types/google-identity-services.d.ts` (nuevo) | Tipos de `/config`, de la verificación, del token en la inscripción y de GIS. |
| `app/utils/configuracion-sitio.ts`, `google.ts`, `google-identity.ts` (nuevos) | Reglas puras con pruebas. |
| `app/utils/errores-api.ts`, `app/utils/inscripcion.ts` | Mensajes de Google; `verificacionCorreoToken` en el multipart. |
| `app/composables/useConfiguracionSitio.ts`, `useGoogleIdentity.ts`, `useCorreoGoogle.ts` (nuevos), `useFormularioInscripcion.ts` | Configuración, botón y estado del correo; correo bloqueado y token en el envío. |
| `app/components/inscripcion/CorreoGoogle.vue`, `BotonGoogle.vue` (nuevos) | Bloque de Google y botón solo cliente. |
| `app/pages/estudiantes.vue`, `general.vue`, `login.vue`, `confirmation.vue`, `privacidad.vue` | Componente junto al correo; redirección al panel; enlace al estado; aviso de privacidad. |
| `nuxt.config.ts`, `.env.example`, `README.md`, `docs/*.md` | Sin `adminUrl` ni `NUXT_PUBLIC_ADMIN_URL`. |
| `.specify/memory/constitution.md` | Enmienda 2.1.0. |
| `tests/*.test.ts` | `google`, `inscripcion`, `bff`, `config`, `errores-api`. |

## Riesgos y pendientes

- **Contrato del backend**: implementado en paralelo y ya publicado (specs 008 y 010 del backend);
  coincide con lo implementado aquí. `001/contracts/bff-landing.md` lo referencia.
- **Orígenes autorizados**: si el dominio de la landing no está en el client ID de Google Cloud, el
  botón muestra el error de Google en la ventana emergente (la inscripción sigue funcionando).
- **Bloqueadores**: algunas extensiones bloquean `accounts.google.com`; se muestra el aviso y se
  escribe el correo a mano.
- **Prueba integrada pendiente**: se hará con el backend y un client ID de prueba (la hará el
  usuario).

## Verificación realizada (2026-09-29)

Build de producción (`node .output/server/index.mjs`) contra un backend simulado de `/api/v1/site`:

- `/login` responde `302` a la `urlPanel` normalizada; sin token del evento, `/api/publico/configuracion`
  responde `503 SITE_NOT_CONFIGURED` y `/login` muestra el aviso con «Reintentar».
- `/api/publico/verificacion-google` reenvía solo `{ idToken }` con `X-Api-Key` y la última IP de
  `X-Forwarded-For`; `422` para una credencial mal formada, `415` con otro `Content-Type` y el `403` del
  backend sin cambios.
- SSR de `/estudiantes` y `/general`: texto de ayuda y marcador de 40 px; sin client ID no aparece nada.
- En el navegador: el botón real de Google se dibuja (`continue_with`, `hl=es`, píldora, 400 px); con
  un GIS simulado, «Verificando…» → chip de estudiante, correo fijado y de solo lectura (con foco),
  nombres completados, SIVIRENO llamado con el correo verificado, «Usar otro correo», error `403` con su
  mensaje, inscripción con `verificacionCorreoToken` y confirmación con «Verificado con Google» y el
  enlace a `/mis-inscripciones`; tras «Usar otro correo» el multipart ya no lleva el token.
- El token del evento, la dirección del backend y una `NUXT_PUBLIC_ADMIN_URL` presentes en el entorno
  del build no aparecen en `.output`.

## Project Structure

### Documentation (this feature)

```text
specs/002-google-en-inscripcion/
├── spec.md
├── plan.md
└── tasks.md
```

Contrato de rutas BFF: `specs/001-landing-multi-evento/contracts/bff-landing.md` (compartido).

### Source Code (repository root)

```text
app/
├── components/inscripcion/  CorreoGoogle.vue, BotonGoogle.vue
├── composables/             useConfiguracionSitio, useGoogleIdentity, useCorreoGoogle,
│                            useFormularioInscripcion
├── pages/                   estudiantes, general, login, confirmation, privacidad
├── types/                   evento.ts, inscription.ts, google-identity-services.d.ts
└── utils/                   configuracion-sitio, google, google-identity, errores-api,
                             inscripcion, rutas-sitio
server/
├── api/publico/             configuracion.get.ts, verificacion-google.post.ts
└── utils/                   api-sitio.ts, sitio.ts
tests/                       google, inscripcion, bff, config, errores-api
```

**Structure Decision**: mismo proyecto Nuxt; sin paquetes nuevos.
