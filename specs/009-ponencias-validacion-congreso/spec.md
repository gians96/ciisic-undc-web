# Feature Specification: Inscripción a ponencias solo para congresistas con pago aprobado (landing)

**Created**: 2026-10-22 · **Status**: Implementado (pendiente de probar en el navegador y de desplegar)

**Contrato**: `backend-ciisic/specs/030-ponencias-validacion-congreso/contracts/api-ponencias-validacion-congreso.md`.
**Orden de despliegue: el backend 030 primero.** Un backend anterior no envía `meta.accesoLibre`: la página se comporta como antes (acceso libre).

## Qué cambia

`/inscripcion-ponencias` deja de ser libre. Según `meta.accesoLibre` de `GET /api/publico/ponencias-especializadas`:

- **Acceso libre apagado** (el valor por defecto del backend):
  1. **Verifica tu inscripción**: documento + el correo con el que se inscribió al congreso → `POST /api/publico/ponencias-especializadas/elegibilidad`
     (BFF del `POST /site/specialized-talk-eligibility`). Si el pago está aprobado se muestra cómo asiste (presencial o virtual) y el tipo de
     inscripción; si no, el motivo del servidor (no inscrito o datos que no coinciden —mismo mensaje—, pago pendiente, rechazada).
  2. **Elige tus ponencias** (solo tras verificar): un congresista **virtual** no tiene límite de cupo y puede elegir las ponencias con el aforo
     presencial lleno; el presencial ve los cupos y «Agotada» como antes.
  3. **Confirma tu inscripción**: se envía solo el documento y el correo; nombres, celular y procedencia salen del congreso.
  Cambiar el documento o el correo después de verificar obliga a verificar otra vez (y vacía la elección).
- **Acceso libre encendido**: el flujo anterior simplificado: elegir y dejar el documento (nombres por la consulta DNI; correo y celular
  opcionales), con el cupo normal.

## Decisiones

- El navegador no decide quién puede inscribirse: el servidor valida en cada inscripción; la verificación previa solo evita elegir a ciegas.
- No se revela quién está inscrito: documento desconocido, otro evento y correo distinto muestran el mismo mensaje (el que envía el servidor).
- El documento y el correo viajan por `POST` en el cuerpo, nunca en la URL ni en la caché del BFF (`no-store`).
- Lógica pura en `app/utils/inscripcion-ponencias.ts` (`accesoLibreDe`, `motivoNoDisponible(ponencia, modo)`, `textoCupos`/`nivelDeCupos` con modo,
  `validarVerificacion`, `cuerpoVerificacion`, `validarFormulario`/`cuerpoInscripcion` con `accesoLibre`, `esErrorDeCongreso`).

## Success Criteria

- **SC-001**: `bun run typecheck`, `bun run test` y `bun run build` en verde; el lint no suma errores (la base ya trae los de `.github/skills` y `.commandcode/skills`).
- **SC-002**: contra el backend 030 local: con el acceso libre apagado, un DNI+correo de un congresista aprobado presencial se inscribe y ocupa aforo; uno virtual
  se inscribe aunque el aforo esté lleno; pendiente, rechazado o desconocido muestran su mensaje y no inscriben; con el acceso libre encendido basta el DNI.
