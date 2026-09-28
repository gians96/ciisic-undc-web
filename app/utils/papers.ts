export interface PaperAuthor {
  firstName: string
  lastName: string
  university: string
}

export const PAPER_MAX_BYTES = 5 * 1024 * 1024

export function validatePaperFile(file: Pick<File, 'name' | 'size' | 'type'>): string {
  if (!/\.pdf$/i.test(file.name) || (file.type && file.type !== 'application/pdf')) return 'Solo se permiten archivos PDF.'
  if (!file.size) return 'El archivo está vacío.'
  if (file.size > PAPER_MAX_BYTES) return 'El PDF supera el máximo de 5 MB.'
  return ''
}
