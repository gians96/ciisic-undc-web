# Tasks: Credencial 3D personal con tecnologías editables

- [x] T001 Portar de `Requisitos_Jeff` (sin `package-lock.json` ni auspiciadores): `CredencialVertical.vue`, `data/tecnologias.ts`, `utils/credencial.ts`, páginas y BFF de lectura
- [x] T002 BFF `POST /api/publico/credencial/:codigo/tecnologias` (JSON, 2 KB, `no-store`) y rutas `credencial` / `tecnologiasCredencial` en `rutas-sitio.ts`
- [x] T003 Catálogo ampliado a 53 tecnologías en 7 grupos y `MAXIMO_TECNOLOGIAS = 8`
- [x] T004 `utils/credencial.ts`: selección (`alternarTecnologia`, `hacerPrincipal`, `normalizarSeleccion`), buscador y mensajes (sin `localStorage`)
- [x] T005 Rediseño: layout `credencial`, `CredencialVertical` (giro por `pointer`, brillo, flotación, marca de agua, QR real con `uqr`) y editor `credencial/Editor.vue`
- [x] T006 Página `/credencial/[codigo]` con guardado automático en el servidor (600 ms, una petición a la vez, `sendBeacon`) y `/credencial` con campo de código; `noindex`
- [x] T007 Texto de próximos pasos presenciales (PDF + enlace) y pruebas (`tests/credencial.test.ts`, `tests/credencial-bff.test.ts`, `tests/credencial-tecnologias-bff.test.ts`, `tests/confirmacion.test.ts`)
- [x] T008 Contrato del BFF, `docs/arquitectura.md` y AGENTS.md
- [ ] T009 Probado en el navegador contra el backend local (375 px y escritorio, guardado en el servidor, sin errores en la consola) y `bun run build` con los íconos resueltos en el servidor
- [ ] T010 Producción: desplegar después del backend 038; poner la URL de la landing en Sistema (panel)
- [x] T011 Rediseño a pantalla completa (2026-10-26): sin barra ni botón, QR y código centrados abajo, editar con doble toque (`esDobleToque`), aviso temporal y aviso de error de guardado
