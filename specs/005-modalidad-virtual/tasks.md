# Tasks: Modalidad virtual de asistencia

- [x] T001 Spec, plan y tareas de `specs/005-modalidad-virtual/`
- [x] T002 `ModalidadAsistencia`, `TipoInscripcionApi.modalidad` e `InscripcionCreada.tipoInscripcion.modalidad` (opcionales)
- [x] T003 `PlanInscripcion.modalidad` y `aModalidad` (ausente, `null` o desconocido → `PRESENCIAL`) en `app/utils/planes.ts`
- [x] T004 Funciones puras: `agruparPlanesPorModalidad`, `hayPlanesVirtuales`, `hayPlanesPresenciales`, `precioDesdeVirtual`, `categoriasConPlanesVirtuales`, `resumirOfertaVirtual`, `hayDescuentoInstitucional`, `claseBadgePlan`
- [x] T005 `useFormularioInscripcion`: exponer `gruposPlanes` y `mostrarKit`; `getBadgeClass` por modalidad; aviso del descuento UNDC solo si algún plan visible lo tiene
- [x] T006 `FormularioGeneral.vue` y `estudiantes.vue`: tarjetas agrupadas («Presencial» / «Virtual (en línea)»), `radiogroup` accesible y kit condicionado
- [x] T007 `/planes`: franja dinámica «También puedes participar de forma virtual, desde S/ X» (`useOfertaVirtual`); sin tarjeta «Modalidad 04»
- [x] T008 `confirmation.vue` + `app/utils/confirmacion.ts` (`proximosPasos`) y FAQ 9 de `preguntas.vue`
- [x] T009 Pruebas Vitest: `tests/planes.test.ts` (fixtures virtuales en una constante aparte) y `tests/confirmacion.test.ts`
- [x] T010 Contrato del BFF (`bff-landing.md`), `docs/INSCRIPCION-FLUJO.md`, `docs/arquitectura.md` y `AGENTS.md`
- [x] T011 Puertas: `typecheck`, `lint` (0 errores), `test`, `build` y token fuera de `.output`
- [ ] T012 Prueba integrada local con backend-ciisic 018 y los tipos virtuales cargados (inscripción virtual de punta a punta)
- [ ] T013 Datos en producción (los crea el dueño del proyecto): `estudiantes_virtual` y `general_virtual`; desplegar la landing después
