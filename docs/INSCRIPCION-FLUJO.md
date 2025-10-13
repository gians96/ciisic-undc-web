# Flujo de Inscripción y Confirmación

## Descripción
Este flujo maneja el registro de inscripciones y la visualización de la confirmación sin necesidad de hacer peticiones GET al API (que está protegida).

## Arquitectura

### 1. Store de Inscripción (`app/stores/inscription.ts`)
```typescript
- state.currentInscription: Almacena temporalmente los datos de la inscripción recién creada
- setInscription(data): Guarda los datos en el store
- clearInscription(): Limpia los datos del store
- hasInscription: Getter que indica si hay datos disponibles
```

### 2. Composable useInscription (`app/composables/useInscription.ts`)
```typescript
- createInscription(): Crea la inscripción y guarda los datos en el store automáticamente
```

### 3. Páginas de Registro (`app/pages/estudiantes.vue` y `app/pages/general.vue`)
```typescript
- handleSubmit(): Envía el formulario
- Tras éxito, redirige a /confirmation?id=X
```

### 4. Página de Confirmación (`app/pages/confirmation.vue`)
```typescript
- loadInscription(): Carga datos desde el store (no hace petición GET)
- Si no hay datos en el store, muestra error 'no_data'
```

## Flujo Completo

1. **Usuario completa el formulario** en `/estudiantes` o `/general`
2. **Se envía POST** a `https://api-ciisic-vii.episundc.pe/api/v1/inscription`
3. **API responde** con el objeto completo de la inscripción:
   ```json
   {
     "success": true,
     "message": "Inscripción creada exitosamente",
     "data": {
       "id": 199,
       "usuario": { ... },
       "tipoInscripcion": { ... },
       "clasificacion": { ... },
       "estado": { ... },
       ...
     }
   }
   ```
4. **useInscription guarda** los datos en el store: `inscriptionStore.setInscription(response.data)`
5. **Redirección** a `/confirmation?id=199`
6. **Página de confirmación** lee desde el store y muestra los datos
7. **No se hace petición GET** al API protegida

## Ventajas

✅ **Seguridad**: No expone endpoint GET protegido al público
✅ **Performance**: No hace petición adicional innecesaria
✅ **UX**: Transición inmediata sin loading extra
✅ **Datos frescos**: Muestra exactamente lo que el servidor retornó

## Limitaciones

⚠️ **Recarga de página**: Si el usuario recarga `/confirmation`, perderá los datos del store
   - Solución: Mostrar mensaje amigable de "Sesión expirada" con contacto de soporte

⚠️ **Link directo**: Si alguien accede directamente a `/confirmation?id=X`, no tendrá datos
   - Solución: Mismo mensaje de "Sesión expirada"

## Alternativas Consideradas

### Opción 1: Endpoint GET público (❌ Rechazada)
- Exponía información sensible sin autenticación
- Cualquiera podría consultar inscripciones por ID

### Opción 2: Token temporal (⚠️ Compleja)
- Requeriría generar y validar tokens de un solo uso
- Más complejidad en backend y frontend

### Opción 3: Store actual (✅ Seleccionada)
- Simple y efectiva para el flujo principal
- No requiere cambios en el backend
- Funciona perfectamente para el caso de uso común

## Mejoras Futuras

1. **Email de confirmación**: Incluir link seguro con token temporal
2. **Persistencia opcional**: Guardar en sessionStorage para resistir recargas
3. **Panel de usuario**: Área privada donde consultar inscripciones con autenticación

## Testing

Para probar localmente:
```bash
# 1. Completar formulario en /estudiantes o /general
# 2. Verificar que redirije a /confirmation?id=X
# 3. Verificar que muestra todos los datos correctamente
# 4. (Opcional) Recargar la página y verificar mensaje de "Sesión expirada"
```

## Notas Técnicas

- El store usa Pinia (auto-importado en Nuxt 3)
- Los datos NO persisten entre sesiones del navegador (intencional)
- El ID en la URL es informativo pero no se usa para consultas
