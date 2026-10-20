# Delegaciones — registro de un grupo con pago conjunto

La página `/delegaciones` permite que el **representante** de un grupo (universidad,
institución) inscriba a **todos sus integrantes** y pague el total con **un solo voucher**.

## Cómo se entra

- **Con link** (lo normal): el staff crea la delegación en el panel (Eventos → Delegaciones) con
  su tarifa y su mínimo, y comparte el link `/delegaciones?delegacion=<código>`. Quien lo abre ve
  esa delegación cargada y su registro **se suma a ella** (no se crea otra). La tarifa que se
  muestra es la de esa delegación, no la del evento.
- **Sin link**: quien entra a `/delegaciones` a secas registra una delegación nueva con la tarifa
  por defecto del evento.

## Secciones del formulario

1. **Representante** — sus datos (nombres, documento, correo, celular) y la casilla «También
   integro la delegación». Si la marca, cuenta como el integrante 1 y sus datos se editan en esa
   misma sección.
2. **Datos de la delegación** — nombre e institución.
3. **Tipo de delegación** — tarjetas «Delegación General» y «Delegación Promocional», tomadas de
   los tipos activos de la categoría `DELEGACIONES` del evento (spec 019 de backend-ciisic,
   códigos `delegacion_general` y `delegacion_grupal`). Es **obligatorio** elegir una: el tipo se
   envía como `tipoInscripcionId` y el backend lo guarda en la delegación y en cada inscripción
   del grupo. Si el evento aún no tiene los dos tipos activos, el formulario muestra el aviso con
   los códigos que faltan y no deja registrar. **No cambia el precio**: la tarifa por persona
   sigue la misma regla (estándar bajo el mínimo, promocional desde él). Si abriste el formulario
   con un link de una delegación que ya eligió tipo, esa tarjeta aparece preseleccionada.
4. **Integrantes** — lista de 1 a 200 personas. Se puede **pegar la lista** (una por línea:
   `DNI, Nombres, Apellidos, Correo, Celular`) en vez de escribirla de una en una.
5. **Pago del total** — un solo pago: modalidad (banco o billetera), medio, código del voucher,
   fecha y el archivo del voucher.
6. **Resumen** — integrantes, tipo elegido, precio por persona y total estimado. El monto
   definitivo lo calcula y confirma el backend.

## Contrato

El backend es `backend-ciisic` (specs 018 y 019):

- `GET /api/v1/site/delegations/tarifa` — la tarifa por defecto del evento (ya resuelta desde los
  tipos `delegacion_general` / `delegacion_grupal` cuando existen).
- `GET /api/v1/site/delegations/link/:codigoLink` — la delegación por su link (exige el token del
  evento: un link de otro evento responde `404`); incluye `tipoInscripcion` si ya eligió tipo.
- `POST /api/v1/site/delegations` — el registro (multipart, con el voucher). Acepta
  `tipoInscripcionId` (opcional en el contrato; la landing siempre lo envía) y responde `422
  REGISTRATION_TYPE_NOT_AVAILABLE` si el tipo no está activo en la categoría `DELEGACIONES`.
- Las tarjetas se arman con `GET /api/publico/planes?categoria=DELEGACIONES` (mismo BFF de planes,
  con la lista blanca de categorías).

El BFF de esta landing (`server/api/publico/delegaciones*`) reenvía esas rutas y agrega el token
del evento y la IP del visitante. El token nunca sale del servidor.

El **pago es de la delegación**: un solo número de operación, una fecha, un medio y un voucher,
guardados en la delegación. Cada inscripción lleva un número de operación interno.

**La tarifa y el total los calcula el backend**; la landing solo muestra un estimado (con la
misma regla: la promocional desde el mínimo de integrantes).
