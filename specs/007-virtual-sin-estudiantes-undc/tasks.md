# Tasks: Planes que no admiten estudiantes UNDC

- [x] T001 `excluyeEstudiantesUndc` en `app/types/evento.ts` y `PlanInscripcion` (`mapearPlanes`), tolerante a un backend anterior
- [x] T002 `planDisponible` con tercer parámetro, `esCorreoDeEstudianteUndc`, `esEstudianteUndcDelFormulario` y `avisoPlanesSinEstudiantes` en `app/utils/planes.ts`
- [x] T003 `useFormularioInscripcion`: `estudianteUndc` (verificación o correo de código) y un solo `avisoPlanes` que suma ambos avisos
- [x] T004 `/planes` (`useOfertaVirtual`, `resumirOfertaVirtual`), FAQ (`respuestaModalidadVirtual`) y mensaje de `REGISTRATION_TYPE_NOT_AVAILABLE`
- [x] T005 Pruebas (`tests/planes.test.ts`, `tests/preguntas.test.ts`), `bun run lint` (0 errores), `bun run typecheck` y `bun run test` en verde, 2026-10-20
- [x] T006 AGENTS.md, `docs/INSCRIPCION-FLUJO.md` y contrato del BFF
- [ ] T007 Prueba integrada contra backend-ciisic real con la spec 020 y el interruptor encendido en `estudiantes_virtual` y `general_virtual`: un correo `2020123456@undc.edu.pe` no ve el plan virtual en `/estudiantes` ni en `/general`; un docente y un externo sí; `bun run build` y comprobar que el token no aparece en `.output`
- [ ] T008 Producción: la rama que despliega la landing (documentada: `rama-beni`) no es `main`; confirmar antes de publicar
