# Feature Specification: Credencial 3D personal con tecnologías editables

**Created**: 2026-10-25 · **Status**: Implementado (pendiente de desplegar después del backend 038)

**Input**: Jeff dejó en la rama `Requisitos_Jeff` una credencial vertical 3D al estilo del ticket de la miduConf, donde cada inscrito elige sus
tecnologías. El usuario pidió probarla, enviarla por correo a los inscritos presenciales (backend spec 039) y que se vea **minimalista pero moderna**.

> **Numeración**: es la spec **013** de la landing. Backend = specs 038 (la API) y 039 (el envío masivo); panel = spec 029. De la rama de Jeff **no se incorporan** el `package-lock.json`
> (esta landing usa `bun.lock`) ni el commit de los auspiciadores (`main` ya tiene su propia versión más nueva); sí se portan `CredencialVertical.vue`, el catálogo de tecnologías, las
> páginas y el BFF, rediseñados.

## Decisiones

- **Página oculta y personal**: `/credencial/<codigo>` (`noindex`, layout `credencial` sin menú ni pie). El código (10 caracteres, el del QR impreso) es la llave: el BFF lo
  valida (`422 INVALID_CODE` sin consultar) y el backend solo responde inscripciones aprobadas del evento. `/credencial` (sin código) ya no es una demostración: solo deja escribir el código.
- **Las tecnologías se guardan en el servidor** (decisión del usuario; Jeff usaba `localStorage`): tras 600 ms sin cambios se manda la lista completa (`POST …/tecnologias`), de a una petición
  por vez (lo que cambió mientras tanto va al terminar) y con `sendBeacon` si se cierra la pestaña. Estados «Guardando… / Guardado / error con Reintentar»; la elección sigue en pantalla si falla.
- **Catálogo de la landing**: `app/data/tecnologias.ts`, 53 tecnologías en 7 grupos (íconos `simple-icons`, ya instalados). Hasta **8** por persona (`MAXIMO_TECNOLOGIAS`, igual que el backend). La primera
  elegida es la **principal**: da el color del resplandor, el borde y la marca de agua; al agregar una pasa al frente y se puede cambiar tocándola en el editor. El `id` de una tecnología no se cambia
  (se guarda en el servidor); un id que ya no existe se ignora.
- **Diseño minimalista, a pantalla completa** (pedido del usuario el 2026-10-26, tras verla en producción): la credencial es **lo único** de la página y ocupa toda la pantalla en vertical (alto de la ventana,
  ancho en proporción); sin barra de navegación, sin pie, sin textos de ayuda ni botón. Giro 3D que sigue al cursor o al dedo (`pointer`), brillo suave, flotación en reposo y
  `prefers-reduced-motion`. Contenido: marca del evento con su **nombre completo** («VIII Congreso Internacional de Ingeniería de Sistemas e Investigación Científica», que viene de la API), **nombre** y tecnologías, y en el pie, **centrados, el QR y debajo el código** (sin etiqueta «Registro»; ya no lleva el rol, la sede ni el título «Credencial»). El QR es **real** y reemplaza el código de
  barras decorativo de Jeff, que parecía escaneable y no lo era). **Editar = doble toque** (doble clic, o Intro con el teclado) sobre la credencial: abre el editor, una hoja inferior (celular) o cuadro centrado
  (escritorio) con buscador y grupos. Un aviso «Toca dos veces para editar» se muestra 5 s al abrir; los correos también lo explican. Si un guardado falla con el editor cerrado, sale un aviso abajo con «Reintentar».
- **Texto de «próximos pasos»** (presenciales): el correo de aprobación trae la credencial en PDF **y** el enlace a la credencial 3D (decisión del usuario: se conserva el PDF).

## Requisitos

- **FR-001**: `GET /api/publico/credencial/:codigo` y `POST …/tecnologias` (BFF, ver `specs/001-landing-multi-evento/contracts/bff-landing.md`): `no-store`, token e IP del visitante, 2 KB en el POST.
- **FR-002**: la página nunca muestra ni pide documento, correo, celular ni montos.
- **FR-003**: sin JavaScript la página se renderiza en el servidor con la credencial (nombre, código y las tecnologías ya guardadas).
- **FR-004**: accesible: la credencial es texto real, el QR tiene `alt`, el editor es un `dialog` modal con `Esc` y foco, los botones de tecnologías usan `aria-pressed`.

## Fuera de alcance

- Descargar la credencial como imagen o compartirla; editar el nombre o el rol.
- El portal del participante y su fotocheck (backend spec 014).
