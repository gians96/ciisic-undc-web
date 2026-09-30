// GET /api/publico/qr/:archivo → GET {backend}/api/v1/site/payment-qr/:archivo con el token del
// evento. Imagen del QR de una billetera subida en el panel (solo las que usa el evento).
export default defineEventHandler(event => responderQrSitio(event, getRouterParam(event, 'archivo') ?? ''))
