import { describe, expect, it } from 'vitest'
import { PAPER_MAX_BYTES, validatePaperFile } from '../app/utils/papers'

describe('archivo del paper', () => {
  it('acepta PDF incluso si el navegador no proporciona MIME', () => {
    expect(validatePaperFile({ name: 'Articulo.PDF', type: '', size: 100 })).toBe('')
  })
  it('rechaza extensiones o MIME incompatibles', () => {
    expect(validatePaperFile({ name: 'paper.png', type: 'application/pdf', size: 100 })).not.toBe('')
    expect(validatePaperFile({ name: 'paper.pdf', type: 'image/png', size: 100 })).not.toBe('')
  })
  it('rechaza archivos vacíos y mayores de 5 MB', () => {
    expect(validatePaperFile({ name: 'paper.pdf', type: 'application/pdf', size: 0 })).not.toBe('')
    expect(validatePaperFile({ name: 'paper.pdf', type: 'application/pdf', size: PAPER_MAX_BYTES + 1 })).not.toBe('')
    expect(validatePaperFile({ name: 'paper.pdf', type: 'application/pdf', size: PAPER_MAX_BYTES })).toBe('')
  })
})
