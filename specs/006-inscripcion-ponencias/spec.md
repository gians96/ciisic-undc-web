# Feature Specification: Inscripción a ponencias especializadas

**Created**: 2026-10-20 · **Status**: Implementado · **Backend**: `backend-ciisic/specs/019-ponencias-especializadas/`

La página `/ponencias-especializadas` muestra ponentes y temas con datos estáticos
(`app/data/ponencias-especializadas.ts`). Falta que la gente pueda **inscribirse** y que el backend sea la
fuente de los cupos: se agrega `/inscripcion-ponencias`, que lee las ponencias publicadas del backend y las
reserva. No se toca la página estática, salvo un botón «Inscríbete a las ponencias».

> Una carpeta `app/pages/ponencias-especializadas/` convertiría en ruta padre a `ponencias-especializadas.vue`
> (Nuxt anida `foo.vue` con `foo/*`) y la página estática dejaría de verse. Por eso la nueva es plana.

## Escenarios

1. **Elegir**: las ponencias por día (tema, ponente con foto o iniciales, ambiente, horario y duración,
   modalidad, cupos que quedan). Las agotadas y las de pago se muestran deshabilitadas con su motivo. Las del
   mismo horario son excluyentes: elegir una reemplaza a la anterior y la tarjeta lo avisa. Hasta 4 por envío.
2. **Datos**: tipo y número de documento; con un DNI de 8 dígitos se consultan los nombres
   (`GET /api/publico/consulta-dni/:numero`) y quedan de solo lectura; si la consulta falla (o con carné) se
   escriben. Correo y celular son opcionales; «¿Perteneces a la UNDC?» (interno/externo) también. Solo el
   documento es obligatorio.
3. **Enviar**: `POST /api/publico/ponencias-especializadas/inscripciones` (todo o nada). Éxito: resumen con día,
   horario y ambiente de cada ponencia y «Lleva tu DNI»; si ya estaba inscrito en alguna, se le dice. Errores
   por código: sin cupos, cruce de horario, ponencia terminada, ya no disponible, nombres requeridos, límite de
   intentos; tras un conflicto se vuelve a leer el programa y se depura la elección.
4. **Estados**: cargando, error («aún no está disponible» si el backend no tiene el módulo o el sitio no está
   configurado), sin ponencias publicadas y confirmación. Los cupos se renuevan al abrir la página y tras
   cada envío (la caché del BFF es de 15 s).
5. **Mostrarlo**: botón en `/ponencias-especializadas`, y enlace «Inscripción a ponencias» en el menú de
   Ponencias (escritorio y móvil) y en el pie.

## Requisitos

- **FR-001**: el navegador nunca llama al backend ni conoce el token: todo pasa por
  `server/api/publico/ponencias-especializadas/*`.
- **FR-002**: la landing no decide cupos ni cruces: los muestra y los evita (`alternarSeleccion`), pero el
  backend es la autoridad (`409 TALK_FULL`, `409 SCHEDULE_CONFLICT`).
- **FR-003**: el tipo de documento viaja en minúsculas (`dni` | `ce`); los opcionales vacíos no se envían.
- **FR-004**: accesibilidad: casillas reales (`sr-only`) dentro de `label`, foco visible, errores con
  `role="alert"`, consulta del DNI y confirmación en regiones `status`, y `prefers-reduced-motion`.
- **FR-005**: privacidad: aviso con enlace a `/privacidad`; la respuesta del backend enmascara el documento.

## Criterios de éxito

- `bun run typecheck`, `lint` (0 errores), `test` y `build` en verde; el token no aparece en `.output`.
- Probado contra el backend local: elegir, reemplazo por horario, DNI desde la caché local, envío con éxito y
  errores de cruce, ponencia inexistente y documento inválido.
