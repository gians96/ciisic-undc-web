# Tasks: delegaciones con planes propios y link individual (spec 010)

- [x] T001 `app/types/delegaciones.ts`: planes, vista del delegado, vista pública del link individual y formulario individual
- [x] T002 `app/utils/delegaciones.ts`: estimado por plan, correo con dominio, validación de integrantes y de la inscripción individual, cuerpos y mensajes de error nuevos; fuera la tarifa global y el registro nuevo
- [x] T003 `useDelegacion` y `rutas-sitio.ts`; BFF `unirse/[codigo].get.ts` y `unirse/[codigo]/participante.post.ts`; se borran `index.post.ts` y `tarifa.get.ts`
- [x] T004 `IntegrantesEditor.vue`: plan por fila y por lista pegada, correo con dominio fijo
- [x] T005 `pages/delegaciones.vue`: vista del delegado (planes, link individual), link individual (`?unirme=`) y aviso sin link
- [x] T006 Pruebas Vitest (`tests/delegaciones.test.ts`), `AGENTS.md` y `docs/arquitectura.md`
- [ ] T007 Probar en el navegador contra el backend local: link del delegado y link individual (con y sin dominio), con planes apagados y con varios activos
- [x] T008 UX del formulario (2026-10-22): rejilla de 12 columnas (documento con tipo, nombres y apellidos en una fila; correo con el dominio pegado al campo y celular en la siguiente), plan como botones con precio, Enter en el documento consulta el DNI sin enviar, foco en la fila nueva, botones deshabilitados visibles, barra de envío fija con el resumen y aviso de éxito a la vista; el link individual usa los mismos controles. Verificado en el navegador con datos simulados (escritorio y móvil); falta probarlo contra el backend local.
