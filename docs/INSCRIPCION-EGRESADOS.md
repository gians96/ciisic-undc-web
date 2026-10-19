# Inscripción del Encuentro de Egresados

La inscripción es gratuita e independiente de los planes del VIII CIISIC 2026. La página
`/semana-sistemica/encuentro-egresados` informa el estado y redirige al Google Forms oficial;
no contiene campos de datos personales, no envía POST y no accede a Google Sheets.

## Flujo definitivo

```text
Landing CIISIC
  → enlace HTTPS de respuesta de Google Forms (nueva pestaña)
  → Google Forms recibe la inscripción
  → Google almacena la respuesta en la hoja institucional vinculada
```

El enlace solo se muestra cuando se configura el URL público aprobado y pasa la validación local.
Se aceptan enlaces `https://forms.gle/...` y
`https://docs.google.com/forms/d/.../viewform`; se rechazan otros dominios, credenciales embebidas,
esquemas diferentes de HTTPS y rutas `/edit` o `formResponse`.

## Datos confirmados

- Fecha: martes 27 de octubre de 2026.
- Horario: 6:00 p. m. – 8:00 p. m. (America/Lima).
- Lugar: Casa de la Cultura.
- Costo: gratuito.
- Último día para inscribirse: viernes 23 de octubre de 2026, hasta las 11:59 p. m.
- Corte exclusivo: `2026-10-24T00:00:00-05:00` (America/Lima).
- La hoja institucional ya está vinculada al formulario. La landing no necesita su ID ni permisos.

## Configuración pública de runtime

| Variable | Uso |
|---|---|
| `NUXT_PUBLIC_ALUMNI_FORM_URL` | URL público de respuesta de Google Forms. Nunca usar `/edit`. |

La única variable del módulo que debe completarse es pública por diseño: contiene el enlace que el
visitante debe poder abrir. No debe contener tokens, IDs de hojas, credenciales ni datos personales.
El corte confirmado se mantiene como configuración pública estable en `nuxt.config.ts`.

Para activar el botón en un entorno local o de producción, configurar exactamente:

```dotenv
NUXT_PUBLIC_ALUMNI_FORM_URL=https://docs.google.com/forms/d/e/1FAIpQLSer4Mw09ZcdlHnbSBE1MY1W1jGS0X_bXTO4twq8ltU5ln4yQA/viewform?usp=publish-editor
```

El `.env` local está ignorado por Git y no se copia automáticamente al despliegue. El mantenedor debe
crear la misma variable pública en la plataforma de producción y realizar un nuevo build/despliegue.

## Estados

1. **Próximamente**: URL ausente/inválido o cierre mal configurado. No se renderiza ningún enlace.
2. **Abiertas**: URL de respuesta válido y plazo no vencido. El botón abre el
   formulario con `target="_blank"` y `rel="noopener noreferrer"`.
3. **Cerradas**: el instante confirmado de cierre ya pasó. El enlace se oculta y se muestra el aviso
   `Inscripciones cerradas`.

El cálculo usa un instante ISO con `-05:00`; la fecha visible se formatea con `America/Lima`. El
instante inicial de SSR se conserva durante la hidratación y el cliente actualiza el estado al montar.

## Apertura autorizada

Antes de configurar el URL público de respuesta, el comité debe:

1. Confirmar la cuenta institucional responsable y el aviso de privacidad del formulario.
2. Confirmar que el enlace es el URL público de **respuesta**, no el URL de edición.
3. Verificar que la fecha límite visible sea el 23 de octubre de 2026 a las 11:59 p. m.
4. Configurar el cierre efectivo dentro de Google Forms o mediante Apps Script para el 24 de octubre
   de 2026 a las 12:00 a. m., hora de Perú. El cierre visual de
   la landing no impide por sí solo que Google Forms reciba respuestas.
5. Probar los estados sin enviar respuestas reales y, después, publicar el formulario y configurar
   `NUXT_PUBLIC_ALUMNI_FORM_URL` de forma coordinada.

## Integración anterior retirada

La versión anterior incluía un formulario Nuxt, endpoints Nitro y una cuenta de servicio que escribía
directamente en Sheets. Ese flujo se eliminó: ya no se usa `google-auth-library`, no existen rutas
`/api/publico/encuentro-egresados/*` y la aplicación no necesita el JSON privado.

El archivo privado externo al repositorio no se borra automáticamente. Una vez confirmado que la
cuenta de servicio no tiene otros consumidores, su responsable debe revocar la clave desde Google
Cloud y conservar o eliminar el archivo siguiendo la política institucional.
