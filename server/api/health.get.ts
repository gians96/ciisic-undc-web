// ============================================================================
// HEALTH CHECK ENDPOINT - VERIFICAR CONFIGURACIÓN DEL SERVIDOR
// ============================================================================

export default defineEventHandler(() => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})
