# Feature Specification: Modalidad virtual de asistencia

**Feature Branch**: `feat/modalidad-virtual` · **Created**: 2026-10-19 · **Status**: Implementado (falta la
prueba integrada con backend-ciisic 018 y los datos en producción; ver `tasks.md`)

**Input**: la organización del CIISIC pidió una modalidad **virtual** de asistencia con tarifas de S/ 30 para
estudiantes y S/ 50 para profesionales (el mismo precio para la comunidad UNDC y para externos). Hasta ahora
todo era presencial (con kit o sin kit). Contrato: spec 018 de `backend-ciisic` (`modalidad` en cada tipo de
inscripción) y su `docs/arquitectura-ecosistema.md`; esta landing solo lo consume.

**Terminología (no confundir)**:

| Término | Qué es | Dónde vive |
|---|---|---|
| **Modalidad de asistencia** (`ModalidadAsistencia`: `PRESENCIAL` \| `VIRTUAL`) | Atributo del **tipo** de inscripción: cómo asiste la persona | `tipo.modalidad` / `tipoInscripcion.modalidad`, nunca en la raíz de una inscripción |
| `ModalidadPago` (`banco` \| `billetera`) | Cómo se pagó | `modalidadPago` en la raíz de la inscripción |
| «Modalidad 01/02/03» de `/planes` | Tarjetas de **categorías** de inscripción (Estudiantes, Público general, FI UNDC) | texto fijo de `app/pages/planes.vue` |
| «Fotocheck virtual» | Credencial digital del portal del inscrito | backend y panel |

## Decisiones de diseño (cerradas)

- Los tipos virtuales viven **dentro** de las categorías existentes `ESTUDIANTES` y `PUBLICO_GENERAL`: no hay
  categoría ni página nueva. Se reutilizan el ciclo, la verificación SIVIRENO y las dos páginas
  `/estudiantes` y `/general`.
- Precio virtual: `precio == precioInstitucional` (30/30 y 50/50) y `disponiblePara = TODOS`; el descuento es 0
  con cualquier correo. No cambian `aplicaPrecioInstitucional` ni el significado de `disponiblePara`.
- Todo es **aditivo y tolerante**: `modalidad` ausente, `null` o desconocida equivale a `PRESENCIAL`. La landing
  nunca envía la modalidad en el POST: el servidor la deduce del tipo elegido.

## User Scenarios & Testing

### User Story 1 - Elijo el plan virtual en el formulario (Priority: P1)

**Acceptance Scenarios**:

1. **Given** `estudiantes_virtual` (`VIRTUAL`) junto a los planes presenciales, **When** abro `/estudiantes`
   (o `/general` con `general_virtual`), **Then** veo dos grupos con los encabezados «Presencial» y «Virtual
   (en línea)», en ese orden; la tarjeta virtual conserva su insignia «VIRTUAL» (estilo de éxito) y su precio.
2. **Given** un plan virtual a S/ 30.00 (o S/ 50.00), **When** escribo cualquier correo (incluido
   `@undc.edu.pe`) o me verifico como estudiante UNDC, **Then** el monto sigue igual, el plan no se oculta y la
   confirmación no muestra «Precio UNDC aplicado».
3. **Given** que ningún plan visible tiene precio institucional menor que el regular, **When** escribo un
   correo `@undc.edu.pe` en `/general`, **Then** el aviso del correo dice «Correo válido» y no «Se aplicará
   descuento UNDC».
4. **Given** que no hay ningún plan presencial a la vista, **Then** no aparece «Ver qué incluye el kit».
5. **Given** que solo hay una modalidad a la vista (el caso de hoy, sin tipos virtuales), **Then** la página se
   ve exactamente igual que antes: un solo grupo, sin encabezados.
6. **Given** el grupo de planes, **Then** sigue siendo un `radiogroup` con teclado (Enter y espacio) y el aviso
   de planes ocultos conserva su `aria-live`; cada grupo con encabezado es un `group` rotulado por él.

### User Story 2 - `/planes` anuncia la participación virtual (Priority: P1)

1. **Given** que la API devuelve al menos un plan `VIRTUAL` en `ESTUDIANTES` o `PUBLICO_GENERAL`, **Then**
   `/planes` muestra la franja «También puedes participar de forma virtual, desde S/ X» (X = precio regular
   mínimo de los planes virtuales, siempre de la API) con enlaces solo a las páginas que tienen planes
   virtuales (`/estudiantes`, `/general`).
2. **Given** que no hay planes virtuales, o que la carga falla, **Then** la franja no aparece y la página (SSR
   incluido) se ve y funciona como hoy. No hay tarjeta «Modalidad 04».

### User Story 3 - La confirmación no promete lo presencial (Priority: P2)

1. **Given** una inscripción con `tipoInscripcion.modalidad = VIRTUAL`, **Then** `/confirmation` muestra
   «Modalidad de asistencia: Virtual (en línea)» y unos próximos pasos sin carnet ni certificado: «la
   organización te compartirá las indicaciones para conectarte a la transmisión del congreso».
2. **Given** `PRESENCIAL`, sin el campo o con `tipoInscripcion = null`, **Then** los pasos son los de siempre.

### User Story 4 - La FAQ es coherente (Priority: P3)

1. **Given** `/preguntas`, **Then** «¿Habrá modalidad virtual?» explica que existe la inscripción virtual (se
   elige el plan Virtual), sin citar montos y manteniendo que talleres y networking son presenciales.

### Edge Cases

- Backend 018 desplegado después de la landing, o datos virtuales aún no creados: no hay planes `VIRTUAL`, todo
  se ve como hoy (la franja de `/planes` no aparece). **Excepción**: la FAQ 9 es texto estático y ya anuncia la
  inscripción virtual; conviene desplegar la landing cuando los tipos virtuales estén cargados.
- Backend 018 y datos virtuales listos antes que esta landing: la landing anterior ignora `modalidad` y muestra
  los planes virtuales como un plan más (sin encabezados), con el monto de la API; la inscripción funciona.
- Un correo que deja una sola modalidad a la vista (p. ej. solo virtuales) muestra un grupo sin encabezado.
- `modalidad` desconocida (p. ej. una futura `HIBRIDA`) se trata como `PRESENCIAL` hasta que la landing la
  conozca.
- Una etiqueta virtual que contenga «SIN» (p. ej. «SINCRÓNICO») no se pinta como advertencia: manda la modalidad.

## Preguntas de negocio abiertas (la organización aún no las responde)

Cómo se entrega el acceso a la transmisión, qué ocurre con asistencia y certificados de los virtuales y si se
exige constancia de estudiante. Por eso los textos son neutros, sin enlaces ni promesas de horas o certificado,
y **nada se bloquea** en la landing.

## Requirements

- **FR-001**: `ModalidadAsistencia` en `app/types/evento.ts`; `TipoInscripcionApi.modalidad` e
  `InscripcionCreada.tipoInscripcion.modalidad` son opcionales y nulos.
- **FR-002**: `PlanInscripcion.modalidad` se normaliza con `aModalidad` (ausente, `null` o desconocido →
  `PRESENCIAL`), igual que `aDisponibilidad`.
- **FR-003**: `agruparPlanesPorModalidad` (Presencial primero; sin encabezados con una sola modalidad),
  `hayPlanesVirtuales`, `hayPlanesPresenciales`, `precioDesdeVirtual`, `categoriasConPlanesVirtuales`,
  `resumirOfertaVirtual`, `hayDescuentoInstitucional` y `claseBadgePlan` en `app/utils/planes.ts`, con
  pruebas; los montos salen siempre de la API.
- **FR-004**: `useFormularioInscripcion` expone `gruposPlanes` y `mostrarKit`; `FormularioGeneral.vue` y
  `estudiantes.vue` (plantilla duplicada) renderizan las tarjetas agrupadas; el modal del kit solo con algún
  plan presencial; el aviso del descuento UNDC solo si algún plan visible lo tiene.
- **FR-005**: `/planes` muestra la franja dinámica con `useOfertaVirtual` (oculta si no hay planes virtuales o
  si falla la carga).
- **FR-006**: `app/utils/confirmacion.ts` (`proximosPasos`) y `confirmation.vue` ramifican por
  `tipoInscripcion.modalidad`.
- **FR-007**: el POST no envía la modalidad; el BFF no cambia (reenvía el JSON tal cual) y la lista blanca de
  categorías de `/api/publico/planes` no cambia.
- **FR-008**: sin variables de entorno nuevas ni cambios en el contrato del BFF más allá del campo aditivo.

## Success Criteria

- **SC-001**: sin tipos virtuales (o con un backend sin el campo) los formularios, `/planes` y `/confirmation`
  se ven exactamente como antes.
- **SC-002**: con tipos virtuales, el monto mostrado y el registrado coinciden con cualquier correo y no hay
  texto de descuento UNDC.
- **SC-003**: `bun run lint` (0 errores), `typecheck`, `test` y `build` en verde; el token del evento no
  aparece en `.output`.
