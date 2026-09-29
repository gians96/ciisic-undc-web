import { describe, expect, it, vi } from 'vitest'
import {
  AYUDA_CORREO_GOOGLE,
  mapearVerificacionGoogle,
  mensajeCorreoGoogle,
  mensajeTipoCuenta,
  nombresDesdeGoogle,
  tokenCorreoParaEnvio,
} from '../app/utils/google'
import {
  URL_SCRIPT_GOOGLE,
  anchoBotonGoogle,
  crearClienteGoogleIdentity,
  opcionesBotonGoogle,
  type EntornoGoogleIdentity,
  type ScriptGoogle,
} from '../app/utils/google-identity'

describe('mensajes por tipo de cuenta', () => {
  it.each([
    ['ESTUDIANTE', 'Estudiante UNDC — tu correo institucional quedó verificado'],
    ['PERSONAL', 'Personal UNDC verificado'],
    ['EXTERNO', 'Correo verificado con Google'],
  ])('%s', (tipoCuenta, texto) => {
    expect(mensajeTipoCuenta(tipoCuenta)).toBe(texto)
    expect(mensajeCorreoGoogle('verificado', { tipoCuenta })).toEqual({ tono: 'exito', texto })
  })

  it('un tipo desconocido se muestra como correo verificado con Google', () => {
    expect(mensajeTipoCuenta('ADMIN')).toBe('Correo verificado con Google')
    expect(mensajeTipoCuenta('toString')).toBe('Correo verificado con Google')
    expect(mensajeTipoCuenta(null)).toBe('Correo verificado con Google')
  })

  it('texto de ayuda del bloque de Google', () => {
    expect(AYUDA_CORREO_GOOGLE).toBe('Opcional: verifica tu correo con Google (recomendado para cuentas @undc.edu.pe)')
  })
})

describe('mensajes del chip por estado', () => {
  it('inactivo no muestra nada y verificando informa', () => {
    expect(mensajeCorreoGoogle('inactivo')).toBeNull()
    expect(mensajeCorreoGoogle('verificando')).toEqual({ tono: 'info', texto: 'Verificando tu correo con Google…' })
  })

  it.each([
    ['GOOGLE_NOT_CONFIGURED', 503, /no está disponible en este momento/],
    ['GOOGLE_UNAVAILABLE', 503, /No pudimos comunicarnos con Google/],
    ['INVALID_GOOGLE_TOKEN', 401, /No pudimos validar tu cuenta de Google/],
    ['INVALID_GOOGLE_CREDENTIAL', 422, /No pudimos validar tu cuenta de Google/],
    ['GOOGLE_EMAIL_NOT_VERIFIED', 403, /no tiene el correo verificado/],
    ['GOOGLE_NOT_AUTHORITATIVE', 403, /Gmail o tu cuenta @undc\.edu\.pe/],
    ['RATE_LIMITED', 429, /Espera un minuto/],
    ['NETWORK_ERROR', 0, /Revisa tu conexión/],
  ])('error %s → aviso en español sin el código técnico', (code, statusCode, esperado) => {
    const mensaje = mensajeCorreoGoogle('error', { falla: { statusCode, code } })
    expect(mensaje?.tono).toBe('aviso')
    expect(mensaje?.texto).toMatch(esperado)
    expect(mensaje?.texto).not.toContain(code)
  })

  it('un error sin detalle también se explica', () => {
    expect(mensajeCorreoGoogle('error')?.texto).toMatch(/escribe tu correo|escribir tu correo/)
  })
})

describe('regla de autocompletado de nombres', () => {
  const google = { nombres: ' Ana  María ', apellidos: 'Pérez Díaz' }

  it('completa nombres y apellidos vacíos con los de Google', () => {
    expect(nombresDesdeGoogle({ nombres: '', apellidos: '  ', desdeDni: false }, google))
      .toEqual({ nombres: 'Ana María', apellidos: 'Pérez Díaz' })
  })

  it('no pisa lo que escribió el usuario (campo por campo)', () => {
    expect(nombresDesdeGoogle({ nombres: 'Anita', apellidos: '', desdeDni: false }, google))
      .toEqual({ nombres: null, apellidos: 'Pérez Díaz' })
    expect(nombresDesdeGoogle({ nombres: 'Anita', apellidos: 'Pérez', desdeDni: false }, google))
      .toEqual({ nombres: null, apellidos: null })
  })

  it('nunca toca los nombres que vinieron de la consulta de DNI (RENIEC manda)', () => {
    expect(nombresDesdeGoogle({ nombres: '', apellidos: '', desdeDni: true }, google)).toEqual({ nombres: null, apellidos: null })
    expect(nombresDesdeGoogle({ nombres: 'ANA MARIA', apellidos: 'PEREZ DIAZ', desdeDni: true }, google)).toEqual({ nombres: null, apellidos: null })
  })

  it('si la cuenta de Google no trae un dato, ese campo no cambia', () => {
    expect(nombresDesdeGoogle({ nombres: '', apellidos: '', desdeDni: false }, { nombres: 'Ana', apellidos: null }))
      .toEqual({ nombres: 'Ana', apellidos: null })
    expect(nombresDesdeGoogle({ nombres: '', apellidos: '', desdeDni: false }, { nombres: ' ', apellidos: null }))
      .toEqual({ nombres: null, apellidos: null })
  })
})

describe('respuesta de la verificación', () => {
  const respuesta = {
    correo: ' 2021003668@UNDC.edu.pe ',
    nombres: 'Ana María',
    apellidos: 'Pérez Díaz',
    tipoCuenta: 'ESTUDIANTE' as const,
    esInstitucional: true,
    verificacionCorreoToken: 'eyJ.verificacion.correo',
  }

  it('toma el correo (en minúsculas), los datos de la cuenta y el token', () => {
    expect(mapearVerificacionGoogle(respuesta)).toEqual({
      datos: { correo: '2021003668@undc.edu.pe', nombres: 'Ana María', apellidos: 'Pérez Díaz', tipoCuenta: 'ESTUDIANTE', esInstitucional: true },
      token: 'eyJ.verificacion.correo',
    })
  })

  it('sin token o sin un correo válido el correo no queda verificado', () => {
    expect(mapearVerificacionGoogle({ ...respuesta, verificacionCorreoToken: '' })).toBeNull()
    expect(mapearVerificacionGoogle({ ...respuesta, correo: 'no-es-correo' })).toBeNull()
    expect(mapearVerificacionGoogle(null)).toBeNull()
  })

  it('un tipo de cuenta desconocido se trata como externo; esInstitucional solo si es true', () => {
    const mapeado = mapearVerificacionGoogle({ ...respuesta, tipoCuenta: 'OTRO' as never, esInstitucional: 'si' as never, nombres: null })
    expect(mapeado?.datos).toMatchObject({ tipoCuenta: 'EXTERNO', esInstitucional: false, nombres: null })
  })
})

describe('token del correo en la inscripción', () => {
  const base = { bloqueado: true, token: 'eyJ.token', correoVerificado: 'ana@undc.edu.pe', correoFormulario: ' Ana@UNDC.edu.pe ' }

  it('se envía mientras el correo está bloqueado y es el verificado', () => {
    expect(tokenCorreoParaEnvio(base)).toBe('eyJ.token')
  })

  it('no se envía si el usuario eligió «Usar otro correo», no hay token o el correo cambió', () => {
    expect(tokenCorreoParaEnvio({ ...base, bloqueado: false })).toBeNull()
    expect(tokenCorreoParaEnvio({ ...base, token: null })).toBeNull()
    expect(tokenCorreoParaEnvio({ ...base, correoFormulario: 'otra@gmail.com' })).toBeNull()
    expect(tokenCorreoParaEnvio({ ...base, correoVerificado: null })).toBeNull()
  })
})

describe('cliente de Google Identity Services', () => {
  /** Doble de <script>: registra oyentes y permite disparar `load` o `error`. */
  class ScriptSimulado implements ScriptGoogle {
    src = ''
    async = false
    defer = false
    quitado = false
    private oyentes: Record<string, Array<() => void>> = {}

    addEventListener(tipo: 'load' | 'error', oyente: () => void) {
      (this.oyentes[tipo] ??= []).push(oyente)
    }

    disparar(tipo: 'load' | 'error') {
      const oyentes = this.oyentes[tipo] ?? []
      this.oyentes[tipo] = []
      for (const oyente of oyentes) oyente()
    }

    remove() {
      this.quitado = true
    }
  }

  function entornoSimulado() {
    const scripts: ScriptSimulado[] = []
    const id = { initialize: vi.fn(), renderButton: vi.fn(), disableAutoSelect: vi.fn(), cancel: vi.fn() }
    const ventana: EntornoGoogleIdentity['ventana'] = {}
    const entorno: EntornoGoogleIdentity = {
      crearScript: () => new ScriptSimulado(),
      buscarScript: src => scripts.find(script => script.src === src && !script.quitado) ?? null,
      insertarScript: (script) => { scripts.push(script as ScriptSimulado) },
      ventana,
    }
    /** Google define window.google.accounts.id y el script dispara `load`. */
    const terminarCarga = () => {
      ventana.google = { accounts: { id } }
      scripts.at(-1)?.disparar('load')
    }
    return { entorno, scripts, id, terminarCarga }
  }

  const contenedor = (ancho = 320) => {
    const div = document.createElement('div')
    Object.defineProperty(div, 'clientWidth', { value: ancho })
    return div
  }

  const callbackDe = (id: { initialize: ReturnType<typeof vi.fn> }, llamada = 0) =>
    (id.initialize.mock.calls[llamada]![0] as GoogleIdConfiguration).callback

  it('inserta el script una sola vez y espera su load (sin sondeo)', async () => {
    const { entorno, scripts, id, terminarCarga } = entornoSimulado()
    const cliente = crearClienteGoogleIdentity(entorno)

    const primera = cliente.cargar()
    const segunda = cliente.cargar()
    expect(scripts).toHaveLength(1)
    expect(scripts[0]).toMatchObject({ src: URL_SCRIPT_GOOGLE, async: true, defer: true })
    expect(URL_SCRIPT_GOOGLE).toBe('https://accounts.google.com/gsi/client')

    let resuelta = false
    void primera.then(() => { resuelta = true })
    await Promise.resolve()
    expect(resuelta).toBe(false)

    terminarCarga()
    await expect(primera).resolves.toBe(id)
    await expect(segunda).resolves.toBe(id)
    await expect(cliente.cargar()).resolves.toBe(id)
    expect(scripts).toHaveLength(1)
  })

  it('si el script no carga lo quita, rechaza y permite reintentar', async () => {
    const { entorno, scripts, id, terminarCarga } = entornoSimulado()
    const cliente = crearClienteGoogleIdentity(entorno)

    const intento = cliente.cargar()
    scripts[0]!.disparar('error')
    await expect(intento).rejects.toThrow('No se pudo cargar Google Identity Services')
    expect(scripts[0]!.quitado).toBe(true)

    const reintento = cliente.cargar()
    expect(scripts).toHaveLength(2)
    terminarCarga()
    await expect(reintento).resolves.toBe(id)
  })

  it('reutiliza un script que ya está en la página', async () => {
    const { entorno, scripts, id, terminarCarga } = entornoSimulado()
    const existente = new ScriptSimulado()
    existente.src = URL_SCRIPT_GOOGLE
    scripts.push(existente)

    const carga = crearClienteGoogleIdentity(entorno).cargar()
    expect(scripts).toHaveLength(1)
    terminarCarga()
    await expect(carga).resolves.toBe(id)
  })

  it('inicializa una vez por client ID (ventana emergente, sin selección automática) y dibuja el botón', async () => {
    const { entorno, id, terminarCarga } = entornoSimulado()
    const cliente = crearClienteGoogleIdentity(entorno)
    const div = contenedor(320)

    const primero = cliente.renderizarBoton(div, { clientId: 'cliente-a', alRecibirCredencial: vi.fn() })
    terminarCarga()
    await expect(primero).resolves.toBe(true)
    await cliente.renderizarBoton(div, { clientId: 'cliente-a', alRecibirCredencial: vi.fn() })

    expect(id.initialize).toHaveBeenCalledTimes(1)
    expect(id.initialize).toHaveBeenCalledWith({ client_id: 'cliente-a', callback: expect.any(Function), auto_select: false, ux_mode: 'popup' })
    expect(id.renderButton).toHaveBeenCalledTimes(2)
    expect(id.renderButton).toHaveBeenLastCalledWith(div, {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      logo_alignment: 'left',
      locale: 'es',
      width: 320,
    })

    await cliente.renderizarBoton(div, { clientId: 'cliente-b', alRecibirCredencial: vi.fn() })
    expect(id.initialize).toHaveBeenCalledTimes(2)
    expect(id).not.toHaveProperty('prompt')
  })

  it('el callback entrega la credencial al receptor vigente (reemplazable)', async () => {
    const { entorno, id, terminarCarga } = entornoSimulado()
    terminarCarga()
    const cliente = crearClienteGoogleIdentity(entorno)
    const anterior = vi.fn()
    const vigente = vi.fn()

    await cliente.renderizarBoton(contenedor(), { clientId: 'cliente-a', alRecibirCredencial: anterior })
    await cliente.renderizarBoton(contenedor(), { clientId: 'cliente-a', alRecibirCredencial: vigente })
    callbackDe(id)({ credential: 'a.b.c', select_by: 'btn' })
    callbackDe(id)({ credential: '', select_by: 'btn' })

    expect(vigente).toHaveBeenCalledTimes(1)
    expect(vigente).toHaveBeenCalledWith('a.b.c')
    expect(anterior).not.toHaveBeenCalled()
  })

  it('liberar cancela el flujo y deja de entregar credenciales al formulario desmontado', async () => {
    const { entorno, id, terminarCarga } = entornoSimulado()
    terminarCarga()
    const cliente = crearClienteGoogleIdentity(entorno)
    const receptor = vi.fn()
    const otro = vi.fn()

    await cliente.renderizarBoton(contenedor(), { clientId: 'cliente-a', alRecibirCredencial: receptor })
    cliente.liberar(otro)
    callbackDe(id)({ credential: 'a.b.c', select_by: 'btn' })
    expect(receptor).toHaveBeenCalledTimes(1)

    cliente.liberar(receptor)
    expect(id.cancel).toHaveBeenCalledTimes(2)
    callbackDe(id)({ credential: 'd.e.f', select_by: 'btn' })
    expect(receptor).toHaveBeenCalledTimes(1)
  })

  it('no inicializa ni dibuja si el formulario se desmontó mientras cargaba el script', async () => {
    const { entorno, id, terminarCarga } = entornoSimulado()
    const controlador = new AbortController()
    const pendiente = crearClienteGoogleIdentity(entorno)
      .renderizarBoton(contenedor(), { clientId: 'cliente-a', alRecibirCredencial: vi.fn(), senal: controlador.signal })

    controlador.abort()
    terminarCarga()
    await expect(pendiente).resolves.toBe(false)
    expect(id.initialize).not.toHaveBeenCalled()
    expect(id.renderButton).not.toHaveBeenCalled()
  })

  it('el ancho del botón sigue al contenedor entre 200 y 400 px', () => {
    expect(anchoBotonGoogle(320)).toBe(320)
    expect(anchoBotonGoogle(287.6)).toBe(287)
    expect(anchoBotonGoogle(150)).toBe(200)
    expect(anchoBotonGoogle(720)).toBe(400)
    expect(anchoBotonGoogle(Number.NaN)).toBe(200)
    expect(opcionesBotonGoogle(1000)).toMatchObject({ text: 'continue_with', locale: 'es', shape: 'pill', width: 400 })
  })
})
