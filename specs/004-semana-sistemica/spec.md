# Feature Specification: Tab «Semana Sistémica» (Comparsa, Reinado, Talleres y Deportes)

**Feature Branch**: `feat/semana-sistemica` · **Created**: 2026-10-15 · **Status**: Implementado

**Input**: el menú no tiene un lugar para las actividades de la Semana Sistémica: la Comparsa y los
Deportes solo aparecen como líneas del cronograma y el Reinado tiene una página suelta
(`/reinado-sistemico`). Se agrega el tab «Semana Sistémica» con un submenú y una página básica por
actividad (fecha, hora, lugar, requisitos y costos, bases, inscripción y fotos). Solo lo básico: el detalle
de las reglas se enlaza a las bases oficiales. No hay contrato con backend-ciisic: el contenido es
estático (el evento de la API no trae agenda).

## User Scenarios & Testing

### User Story 1 - Encuentro las cuatro actividades desde el menú (Priority: P1)

**Acceptance Scenarios**:

1. **Given** escritorio (≥ 1024 px), **When** abro «Semana Sistémica», **Then** veo Comparsa, Reinado,
   Talleres y Deportes; cada enlace lleva a `/semana-sistemica/<actividad>` y el tab queda activo en esas páginas.
2. **Given** móvil, **When** abro el menú, **Then** «Semana Sistémica» es un acordeón con las mismas cuatro
   páginas, abierto si estoy en una de ellas.
3. **Given** abro «Ponencias» y luego «Semana Sistémica», **Then** el primero se cierra; Esc, clic fuera o
   salir con el foco cierran el abierto.
4. **Given** el pie de página, **Then** lista las cuatro páginas en «Explora».

### User Story 2 - Sé cuándo, dónde y cómo participar (Priority: P1)

**Acceptance Scenarios**:

1. **Given** `/semana-sistemica/comparsa`, **Then** veo lunes 26 de octubre, concentración 2:30 p. m. en la
   Casa de la Cultura, recorrido hasta la Plaza de Armas, cuotas (S/ 30 por salón, S/ 50 por ciclo),
   premios, formulario y bases.
2. **Given** `/semana-sistemica/reinado`, **Then** veo miércoles 28 de octubre, 3:00 p. m., Auditorio de la
   Casa de la Cultura, el contenido que ya tenía la página y las fotos de la edición anterior.
3. **Given** `/semana-sistemica/deportes`, **Then** veo viernes 30 de octubre en el Campus UNDC, el
   cronograma del día, las cinco disciplinas, los costos, el plazo y los enlaces a las bases y a
   deportes.episundc.pe.
4. **Given** pasó el cierre de inscripción de una actividad (hora de Lima), **Then** el botón se reemplaza
   por «Inscripciones cerradas» y las bases siguen visibles. El Reinado cerró el 15/10 23:59.

### User Story 3 - Los enlaces antiguos y el cronograma siguen coherentes (Priority: P2)

**Acceptance Scenarios**:

1. **Given** `/reinado-sistemico`, **Then** redirige (301) a `/semana-sistemica/reinado`.
2. **Given** `/semana-sistemica`, **Then** redirige a `/semana-sistemica/comparsa`.
3. **Given** el cronograma y la tarjeta de Comparsa del inicio, **Then** muestran los horarios de las bases y
   enlazan a la página de cada actividad.

### Edge Cases

- Las imágenes son de la edición anterior (2025): llevan la insignia «Imagen de edición anterior».
- «Inscripciones cerradas» se calcula tras montar la página (como `Countdown`): el HTML del servidor muestra
  el botón y el cliente lo cierra si ya pasó el cierre, sin desajuste de hidratación.
- Las bases de Deportes escriben el cierre como `25/10/2025`; se interpreta como 2026.

## Requirements

- **FR-001**: `app/data/semana-sistemica.ts` es la única fuente de fechas, horas, lugares, enlaces, cierres y
  costos de las cuatro actividades, y de `SEMANA_SISTEMICA_MENU` (escritorio, móvil y pie de página).
- **FR-002**: `app/utils/semana-sistemica.ts`: `rutaEnGrupo` (estado activo del tab) e `inscripcionAbierta`
  (cierre en hora de Lima), con pruebas.
- **FR-003**: `LayoutNavDropdown` reemplaza al desplegable escrito a mano de «Ponencias» sin cambiar su
  comportamiento.
- **FR-004**: este cambio toca explícitamente el header, el menú móvil, el pie de página, el cronograma, la
  tarjeta de Comparsa del inicio y el enlace de `ReinadoFeature` (Constitución III), y corrige el favicon
  relativo, que daba 404 en rutas anidadas.
- **FR-005**: sin variables de entorno nuevas, sin llamadas al backend y sin consumir datos de deportes-fi.

## Success Criteria

- **SC-001**: las cuatro páginas responden 200, `/reinado-sistemico` redirige y el menú no desborda entre 1024 y
  1280 px.
- **SC-002**: `lint` (0 errores), `typecheck`, `test` y `build` en verde.
