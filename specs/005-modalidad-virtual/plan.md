# Implementation Plan: Modalidad virtual de asistencia

**Branch**: `feat/modalidad-virtual` | **Date**: 2026-10-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-modalidad-virtual/spec.md`

## Summary

El backend (spec 018 de `backend-ciisic`) agrega el atributo `modalidad` (`PRESENCIAL` | `VIRTUAL`) a cada tipo
de inscripción. La landing lo lee de forma aditiva: agrupa las tarjetas de los formularios por modalidad,
anuncia la oferta virtual en `/planes`, ajusta los textos que solo valen para lo presencial (kit, descuento UNDC,
próximos pasos y FAQ) y no cambia nada visible mientras no existan tipos virtuales. Los precios y la modalidad del
tipo los decide el servidor; el POST no cambia.

## Technical Context

**Language/Version**: TypeScript 5.9, Vue 3.5, Nuxt 4 (SSR, directorio `app/`), Nitro (BFF sin cambios)

**Primary Dependencies**: ninguna nueva

**Testing**: Vitest sobre funciones puras de `app/utils` (no hay pruebas de componentes Vue: toda la lógica nueva
vive en utils puras)

**Constraints**: sin variables de entorno nuevas; sin cambios en `server/`; la landing puede salir antes o después
del backend 018 y de los datos; nada se bloquea por la modalidad (preguntas de negocio abiertas).

## Constitution Check

| Principio | Estado | Cómo se cumple |
|---|---|---|
| I. Contrato del backend | ✅ | `modalidad` se consume tal como la define la spec 018; el precio y la modalidad del tipo los decide el servidor; el POST no envía la modalidad; los montos mostrados salen de la API. |
| II. Token solo en el servidor | ✅ | Sin cambios en el BFF ni en la configuración. |
| III. Stack y diseño | ✅ | Sin dependencias nuevas; se reutilizan los estilos de las tarjetas y de `/planes`; el marketing no cambia: la FAQ 9 solo cambia cuando la API devuelve planes virtuales (el pedido original no la mencionó: el dueño del proyecto debe confirmarla). |
| IV. Accesibilidad | ✅ | El `radiogroup` conserva teclado y `aria` y solo contiene radios (el encabezado del grupo es `aria-hidden`; la modalidad va en el `aria-label` de cada tarjeta); el aviso de planes conserva `aria-live`. |
| V. Calidad | ✅ | La lógica nueva (normalización, agrupación, precio mínimo, descuento, insignia, próximos pasos) vive en utils puras con pruebas. |

## Decisiones

- **D1 — Atributo del tipo, no categoría nueva.** Los tipos virtuales van en `ESTUDIANTES` y `PUBLICO_GENERAL`:
  `/estudiantes` y `/general` los muestran sin páginas ni listas blancas nuevas (`planes.get.ts` no cambia).
- **D2 — `aModalidad` como `aDisponibilidad`.** Ausente, `null` o desconocido → `PRESENCIAL`: «backend nuevo +
  landing vieja» y «landing nueva + backend viejo» siguen funcionando.
- **D3 — Agrupar en una función pura.** `agruparPlanesPorModalidad` devuelve grupos con `titulo` solo si hay más
  de una modalidad; con una sola, un grupo sin encabezado (el DOM añade dos contenedores sin estilo, sin cambio
  visible).
- **D4 — Accesibilidad de los grupos.** Un único `radiogroup` rotulado por «Tipo de inscripción» que solo
  contiene radios: ARIA 1.2 exige que el `radiogroup` posea radios, así que NO hay `role="group"` intermedio y el
  `h3` de cada grupo es solo visual (`aria-hidden="true"`). Para que no se pierda la modalidad, el `aria-label`
  de cada tarjeta es `etiquetaAccesiblePlan` («título, precio» y, si es virtual y el título no lo dice,
  «, modalidad virtual»; lo presencial queda idéntico). Las tarjetas siguen siendo `role="radio"` con `tabindex`,
  Enter y espacio como hoy. Validado con axe-core 4.10.2 sobre la build (`/general` con los dos grupos): sin
  violaciones de `aria-required-children`; `heading-order` (el `h4` de la tarjeta) ya existía sin planes virtuales.
- **D5 — Kit por dato.** `mostrarKit` = hay algún plan presencial a la vista (no un prop por página): una
  categoría con solo planes virtuales no ofrece un kit que no recibe.
- **D6 — El aviso del correo institucional cambia solo con planes virtuales.** `avisoCorreoInstitucional`
  (función pura): sin planes virtuales a la vista devuelve el texto de siempre («Correo institucional - Se
  aplicará descuento UNDC»), aunque ningún plan tenga descuento (SC-001: lo presencial queda idéntico a `main`, sea
  o no engañoso; corregirlo sería una decisión aparte). Solo con planes virtuales a la vista y
  `hayDescuentoInstitucional(availablePlans)` en falso (ningún plan visible tiene precio institucional menor) dice
  «Correo institucional»: reconoce el dominio sin prometer un descuento inexistente.
- **D7 — Franja de `/planes` dinámica.** `useOfertaVirtual` reutiliza `usePlanes('ESTUDIANTES')` y
  `usePlanes('PUBLICO_GENERAL')` (mismas claves que los formularios). Si una carga falla, esa categoría no suma;
  sin planes virtuales no se pinta nada. El «desde» es el precio regular mínimo de los planes virtuales.
- **D8 — Insignia por modalidad.** `claseBadgePlan`: `VIRTUAL` siempre es de éxito (la regla antigua
  `includes('SIN')` también atraparía «SINCRÓNICO»).
- **D9 — Confirmación.** `proximosPasos(modalidad)` en `app/utils/confirmacion.ts`; la rama virtual no habla de
  carnet, certificado, horas ni enlaces.
- **D10 — FAQ 9 por dato.** `respuestaModalidadVirtual(hayPlanesVirtuales)` en `app/utils/preguntas.ts`, alimentada
  por `useOfertaVirtual().oferta` en `preguntas.vue`: con planes virtuales anuncia el plan Virtual (texto neutro);
  sin ellos conserva el texto anterior (idéntico). Así el orden de despliegue de la landing y los datos no deja a
  `/preguntas` contradiciendo a `/estudiantes` y `/general`. El texto nuevo omite deliberadamente que las
  conferencias «quedarán disponibles en la plataforma virtual»: es una promesa sobre contenido grabado que la
  organización no ha confirmado para la modalidad virtual (pregunta de negocio abierta); el dueño puede restituirla.

## Datos y despliegue

- Los tipos virtuales los crea el dueño del proyecto (script SQL idempotente o panel), no el código: en
  `ciisic-viii-2026`, `estudiantes_virtual` (S/ 30.00/30.00, `TODOS`, `VIRTUAL`) en `ESTUDIANTES` y
  `general_virtual` (S/ 50.00/50.00, `TODOS`, `VIRTUAL`) en `PUBLICO_GENERAL`.
- Orden único (el de `backend-ciisic/docs/operacion.md`): respaldo → backend 018 → panel y landing → datos virtuales
  → verificar. La landing por sí sola no cambia nada visible (la FAQ 9 y la franja de `/planes` también dependen de
  los datos), pero los datos creados antes de publicar esta landing se verían en la landing anterior mezclados con
  los presenciales y con los próximos pasos de siempre: si hay que crearlos antes, con `@activo = 0` (o «Activo»
  apagado en el panel) hasta que esta landing esté publicada.
- Hay hasta ~60 s de caché de Nitro (`swr`) tras crear los datos.

## Riesgos

- Un estudiante virtual se inscribe en `/estudiantes`: se le pide el ciclo y se verifica con SIVIRENO como a los
  demás de esa categoría (decisión de diseño); no se exige constancia (pregunta abierta).
- `estudiantes.vue` y `FormularioGeneral.vue` duplican la plantilla: el cambio se hizo en ambos.
- No hay pruebas de componentes Vue: el cableado entre `useFormularioInscripcion`/`preguntas.vue` y las funciones
  puras es de una línea cada uno y la lógica vive en utils probadas (se comprobó además en la build contra un
  backend simulado, con y sin planes virtuales); la inscripción virtual de punta a punta contra el backend real
  (T012) sigue pendiente.
- Cualquier modalidad futura (`HIBRIDA`) se verá como presencial hasta ampliar `MODALIDADES` en `planes.ts`.
