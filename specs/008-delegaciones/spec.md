# Feature Specification: Inscripción de delegaciones (página oculta)

**Created**: 2026-10-21 · **Status**: Implementado · **Contrato**: `backend-ciisic/specs/023-delegaciones-convenio/contracts/api-delegaciones-convenio.md`

**Input**: hay convenio con delegaciones de otras universidades (UNH, UNAT). Un **delegado** inscribe a su
grupo y paga por todos: presencial sin kit a S/ 60 por persona (S/ 50 desde 10 integrantes) o virtual a
S/ 30. El delegado recibe por correo un **link oculto** (no está en el menú, el pie ni los buscadores),
pone su DNI, correo y celular, agrega a sus integrantes —el total se multiplica en vivo—, sube **varios
vouchers** y puede volver con el mismo link para **agregar** integrantes y vouchers.

## User Scenarios & Testing

### User Story 1 - Registro a mi delegación (Priority: P1)

1. **Given** abro `/delegaciones`, **When** escribo mi DNI, **Then** se completan mis nombres con la
   consulta DNI (si falla, los escribo); agrego correo y celular, y marco si también asistiré.
2. **Given** elijo Presencial o Virtual y agrego integrantes (filas o una lista pegada de Excel),
   **Then** veo «N × S/ precio = total» y cuántos faltan para la tarifa promocional.
3. **Given** subo uno o varios vouchers (archivo, medio, número, fecha y monto de cada uno), **Then** veo
   el total, lo declarado y el saldo, y al enviar recibo mi link para volver.

### User Story 2 - Vuelvo con mi link (Priority: P1)

1. **Given** abro `/delegaciones?delegacion=<código>`, **Then** veo mi delegación, mis integrantes
   (documento enmascarado), mis vouchers (número enmascarado) y mi saldo.
2. **Given** quiero sumar a alguien o un voucher, **Then** lo agrego sin tocar lo anterior (la landing no
   ofrece borrar ni editar).

### User Story 3 - El staff me creó la delegación (Priority: P2)

1. **Given** el staff creó mi delegación en el panel, **When** abro mi link, **Then** veo su modalidad y
   su tarifa y agrego mis integrantes y vouchers.

## Requirements

- **FR-001**: la página es **oculta**: `noindex, nofollow`, sin enlaces desde el menú, el pie ni el
  overlay móvil. El enlace del `/planes` sigue siendo el botón de WhatsApp.
- **FR-002**: el tipo, el precio y el monto los decide el backend; la landing **nunca** envía precios,
  totales ni tipos (solo la `modalidad` y el monto que dice cada voucher). El total en pantalla es un
  estimado (`estimarGrupo`), con la tarifa de `GET /api/publico/delegaciones/tarifa`.
- **FR-003**: la modalidad Virtual solo se ofrece si `tarifa.virtual` no es `null` (el evento tiene el tipo
  `delegacion_virtual`); si no, aparece como «Próximamente».
- **FR-004**: el DNI de 7 dígitos (Excel pierde el cero) se completa a 8; con 8 dígitos y sin nombres se
  consulta el DNI por integrante.
- **FR-005**: hasta 6 vouchers por envío (PDF/JPG/PNG/WebP de hasta 5 MB), un archivo por voucher en el
  mismo orden que sus datos; el BFF admite hasta 6 × 5 MB por petición (`LIMITE_DELEGACION_BYTES`).
- **FR-006**: los errores del backend se traducen (`mensajeErrorDelegacion`) y los de campo
  (`representante.*`, `participantes[i].*`) se marcan junto a su campo; los datos escritos se conservan.
- **FR-007**: el código del link se valida en el BFF (`codigoLinkValido`) antes de armar la ruta del backend.

## Success Criteria

- **SC-001**: `bun run typecheck`, `bun run test` y `bun run build` en verde; el token del evento no
  aparece en `.output`.
- **SC-002**: contra el backend local se registra una delegación presencial de 9 → 10 integrantes
  (S/ 60 → S/ 50), una virtual (S/ 30) con dos vouchers, y se vuelve con el link a agregar.

## Out of Scope

- Borrar o corregir integrantes y vouchers desde la landing (lo hace el staff en el panel).
- Pasarela de pago o conciliación automática.
