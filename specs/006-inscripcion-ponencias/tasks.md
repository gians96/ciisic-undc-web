# Tasks: Inscripción a ponencias especializadas

- [x] T001 Spec y tareas de `specs/006-inscripcion-ponencias/`
- [x] T002 Tipos de la API (`app/types/ponencias-especializadas.ts`) y rutas (`rutasSitio`)
- [x] T003 BFF: `server/api/publico/ponencias-especializadas/index.get.ts` (caché 15 s) e `inscripciones.post.ts` (JSON)
- [x] T004 Funciones puras en `app/utils/inscripcion-ponencias.ts`: programa por día, cruces, selección con reemplazo, validación, cuerpo y mensajes de error
- [x] T005 `usePonenciasEspecializadas` (programa con cupos, refresco manual)
- [x] T006 Página `app/pages/inscripcion-ponencias.vue` (elegir, datos con consulta DNI, confirmación y estados)
- [x] T007 Botón «Inscríbete a las ponencias» en `/ponencias-especializadas` y enlaces en el menú, el menú móvil y el pie
- [x] T008 Pruebas Vitest (`tests/inscripcion-ponencias.test.ts`)
- [x] T009 Contrato del BFF (`bff-landing.md`), `docs/arquitectura.md` y `AGENTS.md`
- [x] T010 Prueba en el navegador contra el backend local
- [ ] T011 Producción: desplegar después del backend (migración + seed del evento) y del panel; con `rama-beni` pendiente de llevar a `main`
