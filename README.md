# VII CIISIC Platform

Una plataforma gaming moderna construida con Nuxt 4, TailwindCSS y las mejores prácticas de desarrollo. Incluye componentes modulares.

## 🚀 Características

- **Nuxt 4** - Framework Vue.js de última generación
- **TypeScript** - Tipado estático para mayor robustez
- **TailwindCSS** - Estilos utilitarios modernos
- **Pinia** - Gestión de estado reactiva
- **Componentes modulares** - Arquitectura escalable con principios SOLID
- **Diseño gaming** - Interfaz optimizada para comunidades gaming
- **Auto-import** - Importación automática de componentes

## 📦 Tecnologías

- [Nuxt 4](https://nuxt.com/) - Framework Vue.js
- [Bun](https://bun.sh/) - Runtime y package manager
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS
- [Nuxt Icon](https://github.com/nuxt-modules/icon) - Iconos con Heroicons y Simple Icons
- [TypeScript](https://www.typescriptlang.org/) - Superset de JavaScript

## 🛠️ Instalación

### Prerrequisitos

Asegúrate de tener [Bun](https://bun.sh/) instalado en tu sistema:

```bash
# Windows (PowerShell)
irm bun.sh/install.ps1 | iex

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

### Configuración del proyecto

1. **Clona el repositorio:**
   ```bash
   git clone <repository-url>
   cd congreso/nuxt
   ```

2. **Instala las dependencias:**
   ```bash
   bun install
   ```

## 🚀 Desarrollo

### Servidor de desarrollo

Inicia el servidor de desarrollo en `http://localhost:3000`:

```bash
bun dev
```

### DevTools de Nuxt

Una vez iniciado el servidor, puedes acceder a las DevTools de Nuxt presionando `Shift + Alt + D` en el navegador.

## 🏗️ Construcción y Despliegue

### Build de producción

Construye la aplicación para producción:

```bash
bun run build
```

### Vista previa local

Previsualiza la build de producción localmente:

```bash
bun run preview
```

### Análisis del bundle

Para analizar el tamaño del bundle:

```bash
bun run analyze
```

## 📁 Estructura del Proyecto

```
nuxt/
├── app/
│   ├── components/
│   │   ├── sections/          # Componentes de secciones gaming
│   │   │   ├── HeroSection.vue
│   │   │   ├── GamingCardsSection.vue
│   │   │   ├── TopTrendingSection.vue
│   │   │   └── ...
│   │   └── layout/            # Componentes de layout
│   ├── layouts/
│   │   └── default.vue        # Layout principal con navbar y footer
│   ├── pages/
│   │   └── index.vue          # Página principal
│   ├── composables/           # Funciones reutilizables
│   ├── stores/                # Stores de Pinia
│   └── assets/                # Recursos estáticos
├── public/                    # Archivos públicos
├── nuxt.config.ts             # Configuración de Nuxt
└── package.json               # Dependencias del proyecto
```

## 🎮 Componentes

La plataforma incluye componentes especializados para gaming:

- **HeroSection** - Banner principal con diseño 
- **GamingCardsSection** - Cards
- **TopTrendingSection** - Trending NFT items
- **TopStreamersSection** - Grid de streamers
- **HumanGameSection** - Showcase de juegos
- **ActiveTeamSection** - Perfiles del equipo
- **JoinCommunitySection** - Integración con Discord
- **RoadmapSeasonsSection** - Timeline de temporadas

## 🔧 Comandos Útiles

```bash
# Limpiar node_modules y reinstalar
bun install --force

# Ejecutar en modo de producción
bun start

# Verificar dependencias
bun outdated

# Actualizar dependencias
bun update
```

## 🌐 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
bun add -g vercel

# Desplegar
vercel
```

### Netlify

```bash
# Build command
bun run build

# Publish directory
.output/public
```

### Otros proveedores

Consulta la [documentación de despliegue de Nuxt](https://nuxt.com/docs/getting-started/deployment) para más opciones.

## 📚 Documentación

- [Nuxt 4 Documentation](https://nuxt.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Bun Documentation](https://bun.sh/docs)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia GPL. Ver `LICENSE` para más detalles.

---

Desarrollado por [gians96](https://github.com/gians96) para el VII CIISIC