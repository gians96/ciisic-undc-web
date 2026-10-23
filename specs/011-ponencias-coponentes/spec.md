# Feature Specification: Temas de ponencias especializadas con varios ponentes

**Created**: 2026-10-22 · **Status**: Implementado en la rama `feat/ponencias-coponentes` (sin desplegar)

**Input**: el cronograma de la organización del VIII CIISIC (27 y 28 de octubre) agrega ponentes y mueve temas: cinco ponentes nuevos (con foto y perfil), dos temas que
**comparten dos ponentes** (misma hora y ambiente), Percy Salcedo pasa al martes (Laboratorio 8) y Carlos Almidon al Auditorio. Contrato del backend: spec 032.

> **Numeración**: es la spec **011** de la landing. Backend = spec 032 · Panel = spec 023.

## Decisiones

- **Datos estáticos** (`app/data/ponencias-especializadas.ts`): `SpecializedTalk.speakerId` pasa a `speakerIds` (uno o varios; el primero es el principal). Hay 24 ponentes y 22 temas
  (8 el martes y 14 el miércoles); cada ponente dicta exactamente un tema. Los cinco nuevos son externos (UNH, UNCP y UNAS) y se ordenan junto a los demás externos.
- **Fotos**: los archivos de `FOTOS PONENTES ESPECIALIZADOS` se relacionan por **nombre del archivo** con el ponente (`jorge-pozo`, `angel-almidon`, `javier-poma`, `saul-arauco`,
  `karen-alcos`), se recortan a 4:5 sin ampliar y se guardan en WebP (~30–100 KB en lugar de ~2 MB en PNG).
- **Tarjeta del tema** (`TemaCard`): con varios ponentes muestra todos sus retratos y nombres («Ponentes del tema») y la insignia «Ponentes externos» (solo si todos lo son; con una mezcla,
  «Con ponente externo»). La página de ponentes no cambia.
- **Ambientes**: el Auditorio se ordena después de las aulas y el cronograma lo nombra («Laboratorios, aulas y auditorio»).
- **Inscripción** (`/inscripcion-ponencias`): usa `ponente` y `coponentes` de la API; muestra a todos y la búsqueda los encuentra por cualquiera de sus nombres.

## Despliegue

Backend 032 primero. Las fotos nuevas viajan con la landing: la BD ya las referencia (`/images/ponentes/2026/especializados/<id>.webp`).
