# Tasks: Inscripción a ponencias solo para congresistas con pago aprobado (landing)

- [x] T001 Tipos (`ModoAsistencia`, `ListaPonenciasRespuesta`, `VerificacionCongresista`) y ruta `verificacionPonenciasEspecializadas`
- [x] T002 BFF `server/api/publico/ponencias-especializadas/elegibilidad.post.ts` (JSON, sin caché)
- [x] T003 `usePonenciasEspecializadas`: `accesoLibre` desde `meta` de la lista
- [x] T004 Funciones puras con modo y verificación (`motivoNoDisponible`, `textoCupos`, `nivelDeCupos`, `alternarSeleccion`, `depurarSeleccion`, `destinoTrasElegir`, `validarVerificacion`, `cuerpoVerificacion`, `validarFormulario`, `cuerpoInscripcion`, mensajes `CONGRESS_*`)
- [x] T005 Página `inscripcion-ponencias.vue`: verificar → elegir → confirmar (sin acceso libre) y flujo sencillo con acceso libre
- [x] T006 Pruebas Vitest (`tests/inscripcion-ponencias.test.ts`)
- [x] T007 Contrato del BFF (`bff-landing.md`), `docs/arquitectura.md` y AGENTS.md
- [ ] T008 Prueba en el navegador contra el backend 030 local (presencial, virtual con aforo lleno, pago pendiente, desconocido, acceso libre)
- [ ] T009 Producción: desplegar después del backend 030 (Dokploy tarda ~20 min) y comprobar `/_nuxt/builds/latest.json`
