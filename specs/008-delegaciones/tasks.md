# Tasks: inscripción de delegaciones (spec 008)

- [x] T001 BFF: `GET tarifa`, `GET :codigo`, `POST` (multipart), `POST :codigo/integrantes` y `POST :codigo/pagos` en `server/api/publico/delegaciones/`
- [x] T002 `codigoLinkValido`, `LIMITE_DELEGACION_BYTES` y `codigoDelegacion` en `server/utils`
- [x] T003 `rutasSitio` y tipos (`app/types/delegaciones.ts`)
- [x] T004 `app/utils/delegaciones.ts` (estimado, validación, multipart, errores) y `lista-integrantes.ts`
- [x] T005 `useDelegacion` (composable del BFF)
- [x] T006 `IntegrantesEditor.vue` (filas con consulta DNI y lista pegada) y `PagosEditor.vue` (varios vouchers y «¿Dónde pago?»)
- [x] T007 Página oculta `app/pages/delegaciones.vue` (registro nuevo, link, confirmación y cerradas)
- [x] T008 Pruebas Vitest de las funciones puras y del BFF
- [ ] T009 Probar contra el backend local (presencial 9 → 10, virtual, dos vouchers, volver con el link)
