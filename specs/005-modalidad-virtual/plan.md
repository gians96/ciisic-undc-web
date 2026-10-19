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
| III. Stack y diseño | ✅ | Sin dependencias nuevas; se reutilizan los estilos de las tarjetas y de `/planes`; el marketing no cambia salvo la FAQ 9, pedida de forma explícita. |
| IV. Accesibilidad | ✅ | El `radiogroup` conserva teclado y `aria`; los grupos con encabezado son `group` rotulados; el aviso de planes conserva `aria-live`. |
| V. Calidad | ✅ | La lógica nueva (normalización, agrupación, precio mínimo, descuento, insignia, próximos pasos) vive en utils puras con pruebas. |

## Decisiones

- **D1 — Atributo del tipo, no categoría nueva.** Los tipos virtuales van en `ESTUDIANTES` y `PUBLICO_GENERAL`:
  `/estudiantes` y `/general` los muestran sin páginas ni listas blancas nuevas (`planes.get.ts` no cambia).
- **D2 — `aModalidad` como `aDisponibilidad`.** Ausente, `null` o desconocido → `PRESENCIAL`: «backend nuevo +
  landing vieja» y «landing nueva + backend viejo» siguen funcionando.
- **D3 — Agrupar en una función pura.** `agruparPlanesPorModalidad` devuelve grupos con `titulo` solo si hay más
  de una modalidad; con una sola, un grupo sin encabezado (el DOM añade dos contenedores sin estilo, sin cambio
  visible).
- **D4 — Accesibilidad de los grupos.** Un único `radiogroup` rotulado por «Tipo de inscripción»; cada grupo con
  encabezado es `role="group"` con `aria-labelledby` al `h3`. Las tarjetas siguen siendo `role="radio"` con
  `tabindex`, Enter y espacio como hoy.
- **D5 — Kit por dato.** `mostrarKit` = hay algún plan presencial a la vista (no un prop por página): una
  categoría con solo planes virtuales no ofrece un kit que no recibe.
- **D6 — El descuento UNDC se anuncia por dato.** `hayDescuentoInstitucional(availablePlans)`: si ningún plan
  visible tiene precio institucional menor, el aviso del correo no promete un descuento inexistente.
- **D7 — Franja de `/planes` dinámica.** `useOfertaVirtual` reutiliza `usePlanes('ESTUDIANTES')` y
  `usePlanes('PUBLICO_GENERAL')` (mismas claves que los formularios). Si una carga falla, esa categoría no suma;
  sin planes virtuales no se pinta nada. El «desde» es el precio regular mínimo de los planes virtuales.
- **D8 — Insignia por modalidad.** `claseBadgePlan`: `VIRTUAL` siempre es de éxito (la regla antigua
  `includes('SIN')` también atraparía «SINCRÓNICO»).
- **D9 — Confirmación.** `proximosPasos(modalidad)` en `app/utils/confirmacion.ts`; la rama virtual no habla de
  carnet, certificado, horas ni enlaces.

## Datos y despliegue

- Los tipos virtuales los crea el dueño del proyecto (script SQL idempotente o panel), no el código: en
  `ciisic-viii-2026`, `estudiantes_virtual` (S/ 30.00/30.00, `TODOS`, `VIRTUAL`) en `ESTUDIANTES` y
  `general_virtual` (S/ 50.00/50.00, `TODOS`, `VIRTUAL`) en `PUBLICO_GENERAL`.
- Orden recomendado: backend 018 → datos virtuales → landing. La landing por sí sola no cambia nada visible,
  salvo la FAQ 9 (texto estático).
- Hay hasta ~60 s de caché de Nitro (`swr`) tras crear los datos.

## Riesgos

- Un estudiante virtual se inscribe en `/estudiantes`: se le pide el ciclo y se verifica con SIVIRENO como a los
  demás de esa categoría (decisión de diseño); no se exige constancia (pregunta abierta).
- `estudiantes.vue` y `FormularioGeneral.vue` duplican la plantilla: el cambio se hizo en ambos.
- Cualquier modalidad futura (`HIBRIDA`) se verá como presencial hasta ampliar `MODALIDADES` en `planes.ts`.
