// POST /api/publico/ponencias-especializadas/aforo (JSON { token }) → GET {backend}/api/v1/site/specialized-talk-occupancy
// Aforo, inscritos presenciales y asistencia por tema con el enlace público que comparte el Owner (spec 012; backend spec 036).
// La página lee el token del `#` de /aforo-ponencias y lo manda en el cuerpo; aquí viaja en X-Link-Token. Sin caché.
export default defineEventHandler(event => responderAforoPonencias(event))
