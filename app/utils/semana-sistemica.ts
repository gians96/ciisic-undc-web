// ============================================================================
// SEMANA SISTÉMICA (funciones puras)
// ============================================================================

/** ¿La ruta es una de las del grupo o cuelga de ella? `/semana-sistemica/x` pertenece a `/semana-sistemica`. */
export function rutaEnGrupo(path: string, rutas: readonly string[]): boolean {
  return rutas.some(ruta => path === ruta || path.startsWith(`${ruta}/`))
}

/**
 * ¿Siguen abiertas las inscripciones? `cierre` es un ISO con el offset de Lima
 * (`2026-10-15T23:59:59-05:00`) y `ahora` un instante en milisegundos (`Date.now()`).
 * Con un cierre ilegible se deja abierto: es preferible a cerrar una inscripción por un dato mal escrito.
 */
export function inscripcionAbierta(cierre: string | null | undefined, ahora: number): boolean {
  const limite = Date.parse(String(cierre ?? ''))
  return Number.isNaN(limite) ? true : ahora <= limite
}
