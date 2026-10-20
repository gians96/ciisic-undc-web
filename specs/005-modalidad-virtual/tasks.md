# Tasks: Modalidad virtual de asistencia

- [x] T001 Spec, plan y tareas de `specs/005-modalidad-virtual/`
- [x] T002 `ModalidadAsistencia`, `TipoInscripcionApi.modalidad` e `InscripcionCreada.tipoInscripcion.modalidad` (opcionales)
- [x] T003 `PlanInscripcion.modalidad` y `aModalidad` (ausente, `null` o desconocido → `PRESENCIAL`) en `app/utils/planes.ts`
- [x] T004 Funciones puras: `agruparPlanesPorModalidad`, `hayPlanesVirtuales`, `hayPlanesPresenciales`, `precioDesdeVirtual`, `categoriasConPlanesVirtuales`, `resumirOfertaVirtual`, `hayDescuentoInstitucional`, `claseBadgePlan`
- [x] T005 `useFormularioInscripcion`: exponer `gruposPlanes` y `mostrarKit`; `getBadgeClass` por modalidad; aviso del correo institucional por `avisoCorreoInstitucional` (idéntico a antes sin planes virtuales)
- [x] T006 `FormularioGeneral.vue` y `estudiantes.vue`: tarjetas agrupadas («Presencial» / «Virtual (en línea)»), `radiogroup` que solo contiene radios (encabezado `aria-hidden`, `etiquetaAccesiblePlan`) y kit condicionado
- [x] T007 `/planes`: franja dinámica «También puedes participar de forma virtual, desde S/ X» (`useOfertaVirtual`); sin tarjeta «Modalidad 04»
- [x] T008 `confirmation.vue` + `app/utils/confirmacion.ts` (`proximosPasos`) y FAQ 9 de `preguntas.vue` (condicionada a los datos: `respuestaModalidadVirtual`)
- [x] T009 Pruebas Vitest: `tests/planes.test.ts` (fixtures virtuales en una constante aparte) y `tests/confirmacion.test.ts`
- [x] T010 Contrato del BFF (`bff-landing.md`), `docs/INSCRIPCION-FLUJO.md`, `docs/arquitectura.md` y `AGENTS.md`
- [x] T011 Puertas: `typecheck`, `lint` (0 errores), `test`, `build` y token fuera de `.output`
- [ ] T012 Prueba integrada local con backend-ciisic 018 y los tipos virtuales cargados (inscripción virtual de punta a punta en `/estudiantes` y `/general`; el 201 trae `tipoInscripcion.modalidad = VIRTUAL` y `/confirmation` muestra la fila y los pasos neutros). **Pendiente**: requiere levantar el backend con una BD de desarrollo y su `.env`, no disponibles en la revisión. Lectura estática del backend 018 (`crearInscripcion`): `clasificacionId` es opcional y solo se valida si llega, y la verificación SIVIRENO de una categoría estudiantil sin token no falla (queda sin precio UNDC, que para un tipo virtual es igual); no hay ningún requisito de ciclo propio del tipo virtual, así que el formulario actual no debería producir un 422 por eso
- [ ] T013 Datos en producción (los crea el dueño del proyecto): `estudiantes_virtual` y `general_virtual`; crearlos (o activarlos) cuando esta landing ya esté publicada; antes, con `@activo = 0`
- [x] T014 Revisión: aviso del correo idéntico a antes sin planes virtuales (`avisoCorreoInstitucional`), FAQ 9 condicionada a `useOfertaVirtual` (`app/utils/preguntas.ts`), `radiogroup` solo con radios (encabezado `aria-hidden` y `etiquetaAccesiblePlan`) y pruebas nuevas
