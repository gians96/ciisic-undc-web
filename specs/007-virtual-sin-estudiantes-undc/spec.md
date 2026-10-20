# Feature Specification: Planes que no admiten estudiantes UNDC

**Feature Branch**: `feat/virtual-sin-estudiantes-undc` · **Created**: 2026-10-20 · **Status**: Implementado (falta la
prueba integrada con backend-ciisic 020 y encender el interruptor en producción; ver `tasks.md`)

**Input**: la organización pidió que los **estudiantes de la UNDC no puedan inscribirse en la modalidad
virtual** (asisten de forma presencial) y poder gestionarlo desde el panel. Contrato: spec 020 de
`backend-ciisic` (`excluyeEstudiantesUndc` en cada tipo de inscripción); esta landing solo lo consume. El
panel tiene su propia spec (013).

## Decisiones de diseño (cerradas)

- El backend decide y rechaza (`422 REGISTRATION_TYPE_NOT_AVAILABLE`); la landing solo **oculta** el plan al
  estudiante UNDC y lo explica, igual que con `disponiblePara` (spec 003): `planDisponible(plan, institucional,
  estudianteUndc)` con un tercer parámetro opcional (sin él, nada cambia).
- **Estudiante UNDC** (réplica informativa de `estudianteUndcExcluido` del backend): verificado con SIVIRENO
  (`/estudiantes`) **o** con correo `<8–12 dígitos>@<dominio>` (`esCorreoDeEstudianteUndc`, también en
  `/general`). Docentes, administrativos (`garias@undc.edu.pe`) y externos siguen viendo el plan virtual. Un
  estudiante que escribe un correo no institucional no se detecta (limitación conocida, spec 016 del backend).
- Aviso bajo los planes (`avisoPlanesSinEstudiantes`): «Los planes virtuales no están disponibles para
  estudiantes de la UNDC: elige un plan presencial.» Se suma al aviso de `disponiblePara` en un solo
  `avisoPlanes`.
- `/planes` y la FAQ «¿Habrá modalidad virtual?» agregan «Los estudiantes de la UNDC se inscriben en modalidad
  presencial.» solo si la API marca algún plan **virtual** con el interruptor (`resumirOfertaVirtual` →
  `sinEstudiantesUndc`).
- Tolerante y aditivo: `excluyeEstudiantesUndc` ausente, `null` o raro = `false`; con un backend anterior no se
  oculta nada y el backend nuevo es quien rechaza. Si el backend rechaza igual, el mensaje de
  `REGISTRATION_TYPE_NOT_AVAILABLE` aclara que los estudiantes UNDC no pueden tomar los planes virtuales.
- No se tocan precios, la forma del POST ni el BFF.

## Requirements

- **FR-001**: `excluyeEstudiantesUndc` en `TipoInscripcionApi` y en `PlanInscripcion` (`mapearPlanes`).
- **FR-002**: `planDisponible` oculta el plan al estudiante UNDC; `useFormularioInscripcion` calcula
  `estudianteUndc` con la verificación y el correo del formulario.
- **FR-003**: aviso `avisoPlanesSinEstudiantes`, texto en `/planes` y en la FAQ, y mensaje del error.
- **FR-004**: pruebas en `tests/planes.test.ts`, `tests/preguntas.test.ts`.
