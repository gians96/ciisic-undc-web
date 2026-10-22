# Feature Specification: Delegaciones con planes propios y link individual (landing)

**Created**: 2026-10-22 · **Status**: Implementado en la landing · **Contrato**: `backend-ciisic/specs/029-delegaciones-planes/contracts/api-delegaciones-planes.md`

**Input**: la página oculta `/delegaciones` (spec 008) permitía que el delegado creara su delegación con una tarifa global (S/ 60, S/ 50 desde 10 y S/ 30 virtual). Ahora cada
delegación tiene sus propios planes (Con kit, Sin kit y Virtual) con su precio, la crea el staff, y los integrantes pueden inscribirse solos con un link individual y su correo
institucional (sin Google). Reemplaza la [spec 008](../008-delegaciones/spec.md) en lo que toca al registro nuevo y la tarifa.

## Decisiones

- **Tres estados por parámetro**: `?delegacion=<código>` (vista del delegado), `?unirme=<código>` (link individual) y sin parámetro (aviso «usa el link que te envió la organización»).
  Se eliminan el «Registro nuevo», la tarifa global, `estimarGrupo` de un solo precio, `validarDelegado` y `construirFormDataRegistro`, y las rutas BFF `index.post` y `tarifa.get`.
- **Vista del delegado**: sus planes con precio, los integrantes con su plan, agregar integrantes (cada uno con su plan; con un solo plan activo ya viene elegido), vouchers como antes y el
  **link individual** para compartirlo con el grupo (si está encendido). El estimado suma el precio de cada plan; el precio promocional solo baja a los planes que lo tienen.
- **Link individual** (`/delegaciones?unirme=<código>`): la persona elige su plan (tarjetas con su precio), completa sus datos (DNI con consulta de nombres) y su correo. Con `dominioCorreo` solo escribe
  **el prefijo** y ve el dominio fijo (`@unac.edu.pe`); si pega el correo completo del dominio, se deja el prefijo. **Sin Google**. El pago es del grupo: lo dice la pantalla de éxito.
- **Dominio**: el servidor es quien decide (`EMAIL_DOMAIN_NOT_ALLOWED`); la landing solo evita el error (`validarIntegrantes` / `validarInscripcionIndividual`). En la lista pegada un correo del dominio se reduce a su prefijo.
- El navegador nunca envía precios, montos ni tipos; solo el `plan` y, en el link individual, `correoPrefijo` o `correo`.

## Despliegue

**Backend 029 primero**; luego el panel y esta landing. La página sigue oculta (`noindex`, sin enlaces).
