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
3. **Integrantes** — lista de 1 a 200 personas. Se puede **pegar la lista** (una por línea:
   `DNI, Nombres, Apellidos, Correo, Celular`) en vez de escribirla de una en una.
4. **Pago del total** — un solo pago: modalidad (banco o billetera), medio, código del voucher,
   fecha y el archivo del voucher.
5. **Resumen** — integrantes, precio por persona y total estimado. El monto definitivo lo calcula
   y confirma el backend.

## Contrato

El backend es `backend-ciisic` (spec 018):

- `GET /api/v1/site/delegations/tarifa` — la tarifa por defecto del evento.
- `GET /api/v1/site/delegations/link/:codigoLink` — la delegación por su link (exige el token del
  evento: un link de otro evento responde `404`).
- `POST /api/v1/site/delegations` — el registro (multipart, con el voucher).

El BFF de esta landing (`server/api/publico/delegaciones*`) reenvía esas rutas y agrega el token
del evento y la IP del visitante. El token nunca sale del servidor.

El **pago es de la delegación**: un solo número de operación, una fecha, un medio y un voucher,
guardados en la delegación. Cada inscripción lleva un número de operación interno.

**La tarifa y el total los calcula el backend**; la landing solo muestra un estimado (con la
misma regla: la promocional desde el mínimo de integrantes).
