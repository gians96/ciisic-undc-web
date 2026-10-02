# Feature Specification: Planes según la condición UNDC

**Feature Branch**: `feat/disponibilidad-tipos` · **Created**: 2026-10-02 · **Status**: Implementado

**Input**: en `/general`, un correo `@undc.edu.pe` debe ver **solo** «Profesionales y público general con
kit» a S/ 120: el plan sin kit es solo para externos. Antes se mostraban los dos y, como el precio UNDC
del plan sin kit estaba en 0, aparecía a S/ 0.00. Contrato: `backend-ciisic/specs/016-disponibilidad-tipos/`.

## User Scenarios & Testing

### User Story 1 - Solo veo los planes que me corresponden (Priority: P1)

**Acceptance Scenarios**:

1. **Given** `general_sin_kit` con `disponiblePara = EXTERNOS`, **When** escribo un correo
   `@undc.edu.pe` en `/general`, **Then** veo solo el plan con kit a S/ 120 y el aviso «Con un correo
   @undc.edu.pe solo se muestran los planes para la comunidad UNDC.» (`aria-live`).
2. **Given** otro correo, **Then** veo los dos planes a su precio regular (140 y 80), sin aviso.
3. **Given** elegí el plan sin kit, **When** cambio a un correo `@undc.edu.pe`, **Then** el plan deja de
   mostrarse y la selección se limpia.
4. **Given** un plan `INSTITUCIONAL`, **Then** solo aparece con la condición UNDC (correo del dominio en
   `/general`, estudiante verificado en `/estudiantes`); a los demás se les avisa que existe.
5. **Given** el backend responde `REGISTRATION_TYPE_NOT_AVAILABLE` (p. ej. el DNI ya está registrado con un
   correo UNDC), **Then** veo un mensaje en español, la selección se limpia y los planes se recargan.

### Edge Cases

- Backend anterior sin `disponiblePara` (o valor desconocido): el plan se ofrece a todos.
- Durante la re-verificación de estudiante (el precio vuelve al regular mientras se consulta) no se
  limpia la selección; se decide al terminar.
- Si todos los planes quedan ocultos, el aviso reemplaza a «No hay tipos de inscripción disponibles».

## Requirements

- **FR-001**: `PlanInscripcion.disponiblePara` (normalizado a `TODOS`) y `planDisponible(plan,
  institucional)`, réplica de `tipoDisponible` del backend con la misma condición del precio.
- **FR-002**: `availablePlans` solo trae los planes disponibles; `avisoPlanes` explica los ocultos.
- **FR-003**: la selección se limpia con `debeLimpiarPlan` (plan no disponible y sin verificación en curso).
- **FR-004**: `REGISTRATION_TYPE_NOT_AVAILABLE` tiene mensaje en español (`app/utils/errores-api.ts`) y se
  trata como `REGISTRATION_TYPE_INVALID`.

## Success Criteria

- **SC-001**: Con un correo UNDC, `/general` nunca muestra un plan «solo externos» ni un precio de S/ 0.00.
- **SC-002**: `lint` (0 errores), `typecheck`, `test` y `build` en verde; sin variables de entorno nuevas.
