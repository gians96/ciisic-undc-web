import type { SpecializedSpeaker, SpecializedTalk } from '../data/ponencias-especializadas'

export interface DiaDeTemas {
  date: string
  /** Ej.: «Martes 27 de octubre». */
  etiqueta: string
  talks: SpecializedTalk[]
}

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

/** «2026-10-27» → «Martes 27 de octubre» (sin Intl: el resultado no depende del entorno). */
export function etiquetaDia(date: string): string {
  const [anio, mes, dia] = date.split('-').map(Number)
  if (!anio || !mes || !dia) return date
  const fecha = new Date(Date.UTC(anio, mes - 1, dia, 12))
  return `${DIAS[fecha.getUTCDay()]} ${dia} de ${MESES[mes - 1]}`
}

function minutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export function duracionMin(start: string, end: string): number {
  return minutos(end) - minutos(start)
}

/** «45 min»; desde la hora completa, «1 h» o «1 h 30 min». */
export function duracionTexto(min: number): string {
  if (min < 60) return `${min} min`
  const horas = Math.floor(min / 60)
  const resto = min % 60
  return resto ? `${horas} h ${resto} min` : `${horas} h`
}

/** «12:00» → «12:00 p. m.»; «09:05» → «9:05 a. m.»; «00:30» → «12:30 a. m.». */
export function formatoHora12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const hora = h ?? 0
  const sufijo = hora >= 12 ? 'p. m.' : 'a. m.'
  const hora12 = hora % 12 === 0 ? 12 : hora % 12
  return `${hora12}:${String(m ?? 0).padStart(2, '0')} ${sufijo}`
}

/** «12:00 – 12:45 p. m.» (el sufijo se comparte cuando ambas horas caen en el mismo turno). */
export function rangoHorario(start: string, end: string): string {
  const inicio = formatoHora12(start)
  const fin = formatoHora12(end)
  const sufijoInicio = inicio.slice(inicio.indexOf(' ') + 1)
  const sufijoFin = fin.slice(fin.indexOf(' ') + 1)
  return sufijoInicio === sufijoFin ? `${inicio.slice(0, inicio.indexOf(' '))} – ${fin}` : `${inicio} – ${fin}`
}

/** Externos primero y luego el resto, conservando el orden original dentro de cada grupo. */
export function ponentesOrdenados(speakers: readonly SpecializedSpeaker[]): SpecializedSpeaker[] {
  return [...speakers.filter(s => s.external), ...speakers.filter(s => !s.external)]
}

/** Laboratorios, luego aulas y al final el auditorio; dentro de cada tipo, por número. */
function claveAmbiente(room: string): [number, number] {
  const numero = Number(room.match(/\d+/)?.[0] ?? 0)
  const tipo = /^laboratorio/i.test(room) ? 0 : /^aula/i.test(room) ? 1 : 2
  return [tipo, numero]
}

/** Agrupa los temas por día (cronológico) y los ordena por hora y ambiente. */
export function temasPorDia(talks: readonly SpecializedTalk[]): DiaDeTemas[] {
  const dias = new Map<string, SpecializedTalk[]>()
  for (const talk of talks) dias.set(talk.date, [...(dias.get(talk.date) ?? []), talk])

  return [...dias.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, delDia]) => ({
      date,
      etiqueta: etiquetaDia(date),
      talks: [...delDia].sort((a, b) => {
        if (a.start !== b.start) return a.start.localeCompare(b.start)
        const [tipoA, numeroA] = claveAmbiente(a.room)
        const [tipoB, numeroB] = claveAmbiente(b.room)
        return tipoA - tipoB || numeroA - numeroB
      }),
    }))
}

export function ponentesPorId(speakers: readonly SpecializedSpeaker[]): Map<string, SpecializedSpeaker> {
  return new Map(speakers.map(speaker => [speaker.id, speaker]))
}

/** Quienes dictan el tema, en el orden de `speakerIds` (el principal primero). Un id desconocido se omite. */
export function ponentesDelTema(talk: Pick<SpecializedTalk, 'speakerIds'>, porId: ReadonlyMap<string, SpecializedSpeaker>): SpecializedSpeaker[] {
  return talk.speakerIds.flatMap(id => porId.get(id) ?? [])
}

/** «Ponente», «Ponente externo», «Ponentes» o «Ponentes externos» (solo si todos lo son). */
export function etiquetaDePonentes(externos: readonly boolean[]): string {
  const plural = externos.length > 1
  const todosExternos = externos.length > 0 && externos.every(Boolean)
  return `${plural ? 'Ponentes' : 'Ponente'}${todosExternos ? (plural ? ' externos' : ' externo') : ''}`
}

/** Párrafos del perfil: se separan con líneas en blanco y se ignoran los vacíos. */
export function parrafosDelPerfil(bio: string): string[] {
  return bio.split(/\n\s*\n/).map(parrafo => parrafo.trim()).filter(Boolean)
}
