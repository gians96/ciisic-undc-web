# Tasks: Página del aforo de las ponencias especializadas

- [x] T001 Tipos `PonenciaAforo`, `PonenteAforo` y `AforoPonencias` (backend spec 036)
- [x] T002 BFF: `encabezados` en `PeticionSitio`, `tokenDelCuerpoAforo`, `responderAforoPonencias` y `POST /api/publico/ponencias-especializadas/aforo` (sin caché, 1 KB)
- [x] T003 `app/utils/aforo-ponencias.ts` (token del `#`, nivel, barra y textos) y `ponenciasPorDia` / `ponentesDeLaPonencia` genéricos
- [x] T004 Página oculta `/aforo-ponencias` con estados de carga, enlace no válido, error y actualización cada minuto
- [x] T005 Pruebas (`tests/aforo-ponencias.test.ts`, `tests/bff.test.ts`) y contrato del BFF
- [x] T006 Probado contra el backend local con el enlace creado en el panel: cifras, tonos (lleno, casi lleno), token alterado = «Este enlace no es válido», el token solo viaja en el cuerpo del POST,
  sin errores en la consola y sin desplazamiento horizontal a 375 px
- [x] T007 Producción: desplegado después del backend 036 (2026-10-25)
- [x] T008 «Ver inscritos» en cada tema: nombre, modo y hora de asistencia (`resumenDeInscritos`, `horaLima`), pedido por el usuario
