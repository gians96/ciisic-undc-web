# Registro de papers

La recepción de artículos del VIII CIISIC 2026 se realiza en EasyChair:

<https://easychair.org/conferences/?conf=viiiciisic2026>

El botón **Registrar paper** de `/papers` abre directamente esa convocatoria en una pestaña nueva.
La ruta histórica `/papers/registro` se conserva únicamente como redirección HTTP temporal hacia
EasyChair, para no romper enlaces previamente compartidos. La landing ya no presenta ni procesa un
formulario de registro de papers.

## Integración anterior

El BFF `POST /api/publico/ponencias` y su contrato con `POST /api/v1/site/papers` permanecen en el
repositorio por compatibilidad, pero la interfaz pública no los consume. Su eliminación definitiva
debe coordinarse con `backend-ciisic` mediante el protocolo de cambio de contrato del ecosistema.

No deben añadirse tokens, credenciales ni parámetros sensibles de EasyChair al código del cliente.

## Verificación

- Confirmar que **Registrar paper** apunta al dominio `easychair.org`.
- Confirmar que `/papers/registro` redirige al mismo destino.
- Ejecutar `bun run test`, `bun run lint`, `bun run typecheck` y `bun run build`.
