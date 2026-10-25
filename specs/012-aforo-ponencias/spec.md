# Feature Specification: Página del aforo de las ponencias especializadas

**Created**: 2026-10-25 · **Status**: Implementado en la rama `feat/aforo-ponencias` (sin desplegar)

**Input**: el usuario quiere ver por tema el **aforo**, los **inscritos** y la **asistencia en puerta** de las ponencias especializadas en una **página aparte**,
pública, a la que solo se llega con un enlace que **él genera y comparte** desde el panel. `/ponencias-especializadas` no cambia. Contrato del backend: spec 036.

> **Numeración**: es la spec **012** de la landing. Backend = spec 036 · Panel = spec 027 (la tarjeta que crea, copia, renueva y desactiva el enlace).

## Decisiones

- **Página plana y oculta** `app/pages/aforo-ponencias.vue` (no una carpeta: convertiría en ruta padre a otra página). `noindex, nofollow`, `referrer: no-referrer` y sin
  enlaces en el menú ni en el pie. El enlace es `<landing>/aforo-ponencias#<token>`: el token va tras el `#` (el navegador no lo envía a ningún servidor ni en `Referer`),
  vive solo en memoria y se manda por `POST` en el cuerpo al BFF, que lo reenvía en `X-Link-Token` (`responderAforoPonencias`, `tokenDelCuerpoAforo`). Nunca va en una URL,
  en la consola ni en el `<head>`.
- **Qué muestra**: por día (mismo orden que el programa, `ponenciasPorDia`) una tarjeta por tema con el ambiente, el tema, los ponentes, los **inscritos presenciales** frente
  al aforo con una barra («14 / 20»), los **cupos libres** («6 cupos libres», «Lleno» o «Sin límite de aforo»), el horario y la **asistencia** registrada en puerta. Los virtuales
  no se muestran aparte y no hay totales por día (decisión del usuario). Nada de personas.
- **Tonos**: libre (cian), casi lleno desde el 80 % (ámbar) y lleno (rojo) — `nivelOcupacion`.
- **Actualización**: sola cada 60 s con la pestaña visible, al volver a la pestaña si pasó más de 30 s y con el botón «Actualizar». Si una lectura falla con cifras a la vista,
  se conservan y se avisa. `404 LINK_NOT_FOUND` (enlace renovado, desactivado o mal copiado) muestra «Este enlace no es válido».

## Despliegue

Backend 036 primero (sin él el BFF recibe 404 y la página dice que el enlace no es válido). La página no aparece en ningún menú: solo se abre con el enlace del panel.
