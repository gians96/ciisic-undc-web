<template>
  <div class="inscripcion-page min-h-screen bg-[#041d39] text-white">
    <section class="ins-hero relative overflow-hidden border-b border-white/10 px-6 py-14 sm:py-16 lg:px-8">
      <div class="ins-grid absolute inset-0" aria-hidden="true" />
      <div class="relative mx-auto max-w-4xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary-300">VIII CIISIC UNDC · 2026</p>
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Inscripción a ponencias especializadas</h1>
        <p class="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
          <template v-if="accesoLibre">
            Elige las ponencias a las que asistirás y deja tu DNI. Son gratuitas, con cupos limitados, y la asistencia se registra con tu DNI en la puerta.
          </template>
          <template v-else>
            Las ponencias son para los inscritos al congreso con el pago aprobado. Verifica tu inscripción con tu DNI y tu correo, elige tus ponencias y registra tu asistencia con tu DNI en la puerta.
          </template>
        </p>
        <div class="mt-7 flex flex-wrap justify-center gap-3 text-sm">
          <span class="summary-chip"><Icon name="heroicons:ticket" class="h-5 w-5 text-primary-400" aria-hidden="true" />Gratuitas</span>
          <span v-if="!accesoLibre" class="summary-chip"><Icon name="heroicons:check-badge" class="h-5 w-5 text-primary-400" aria-hidden="true" />Para inscritos con pago aprobado</span>
          <span class="summary-chip"><Icon name="heroicons:identification" class="h-5 w-5 text-primary-400" aria-hidden="true" />Lleva tu DNI</span>
          <NuxtLink to="/ponencias-especializadas" class="summary-chip hover:border-primary-400/50 hover:text-white">
            <Icon name="heroicons:user-group" class="h-5 w-5 text-primary-400" aria-hidden="true" />Conoce a los ponentes
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Confirmación -->
    <section v-if="resultado" class="mx-auto max-w-3xl px-6 py-14 lg:px-8" aria-labelledby="titulo-listo">
      <div ref="bloqueResultado" tabindex="-1" class="listo-card rounded-3xl border border-emerald-300/30 p-7 sm:p-9" role="status">
        <span class="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
          <Icon name="heroicons:check-circle" class="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 id="titulo-listo" class="mt-5 text-3xl font-extrabold">¡Listo, {{ primerNombre }}!</h2>
        <p class="mt-2 text-slate-300">
          Quedaste inscrito con tu {{ resultado.asistente.tipoDocumento.toUpperCase() }} {{ resultado.asistente.numeroDocumento }}.
          Lleva tu documento: con él se registra tu asistencia.
        </p>
        <p v-if="resultado.modoAsistencia" class="mt-3 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-400/10 px-4 py-1.5 text-sm font-semibold text-primary-200">
          <Icon :name="resultado.modoAsistencia === 'VIRTUAL' ? 'heroicons:video-camera' : 'heroicons:map-pin'" class="h-4 w-4" aria-hidden="true" />
          Asistes de forma {{ etiquetaModoAsistencia(resultado.modoAsistencia).toLowerCase() }}
        </p>
        <ul class="mt-6 space-y-3">
          <li v-for="item in resultado.inscripciones" :key="item.id" class="rounded-2xl border border-white/10 bg-white/[.04] p-4">
            <p class="font-semibold leading-snug text-white">{{ item.ponencia.tema }}</p>
            <p class="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
              <span class="inline-flex items-center gap-1.5"><Icon name="heroicons:calendar-days" class="h-4 w-4 text-primary-400" aria-hidden="true" />{{ etiquetaDia(item.ponencia.fecha) }}</span>
              <span class="inline-flex items-center gap-1.5"><Icon name="heroicons:clock" class="h-4 w-4 text-primary-400" aria-hidden="true" />{{ rangoHorario(item.ponencia.horaInicio, item.ponencia.horaFin) }}</span>
              <span class="inline-flex items-center gap-1.5"><Icon name="heroicons:map-pin" class="h-4 w-4 text-primary-400" aria-hidden="true" />{{ item.ponencia.ambiente }}</span>
            </p>
            <p v-if="item.yaInscrito" class="mt-2 text-xs font-semibold text-amber-200">Ya estabas inscrito en esta ponencia.</p>
          </li>
        </ul>
        <p class="mt-6 text-sm text-slate-400">
          <template v-if="resultado.modoAsistencia === 'VIRTUAL'">Como asistente virtual no ocupas aforo presencial. La organización compartirá las indicaciones para seguir las ponencias.</template>
          <template v-else>Si no puedes asistir, puedes cambiar de ponencia en la puerta con tu DNI mientras haya cupo.</template>
        </p>
        <div class="mt-7 flex flex-wrap gap-3">
          <button type="button" class="btn btn-primary" @click="nuevaInscripcion">Inscribir a otra persona</button>
          <NuxtLink to="/ponencias-especializadas" class="btn btn-outline">Ver ponentes y temas</NuxtLink>
        </div>
      </div>
    </section>

    <template v-else>
      <!-- Estados del programa -->
      <section v-if="cargando" class="mx-auto max-w-3xl px-6 py-20 text-center text-slate-300" role="status">
        <Icon name="heroicons:arrow-path" class="mx-auto h-8 w-8 animate-spin text-primary-400" aria-hidden="true" />
        <p class="mt-4">Cargando las ponencias…</p>
      </section>

      <section v-else-if="error || !ponencias.length" class="mx-auto max-w-3xl px-6 py-20 text-center" role="status">
        <Icon :name="error ? 'heroicons:exclamation-triangle' : 'heroicons:calendar-days'" class="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
        <h2 class="mt-4 text-2xl font-bold">
          {{ error ? 'No pudimos cargar las ponencias' : 'Aún no hay ponencias abiertas a inscripción' }}
        </h2>
        <p class="mx-auto mt-3 max-w-xl text-slate-300">
          {{ error ? (noDisponible ? 'La inscripción a ponencias aún no está disponible. Vuelve a intentarlo más tarde.' : 'Revisa tu conexión e inténtalo nuevamente.') : 'Cuando la organización las publique aparecerán aquí.' }}
        </p>
        <button type="button" class="btn btn-outline mt-6" @click="recargar()">Reintentar</button>
      </section>

      <template v-else>
        <!-- Verificación (solo sin acceso libre): el documento y el correo del congreso -->
        <section v-if="!accesoLibre" class="border-b border-white/10 bg-[#03172d] px-6 py-12 lg:px-8 lg:py-16" aria-labelledby="titulo-verificacion">
          <form class="mx-auto max-w-3xl" novalidate @submit.prevent="verificar">
            <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Paso 1</p>
            <h2 id="titulo-verificacion" tabindex="-1" class="mt-2 scroll-mt-40 text-3xl font-bold tracking-tight outline-none">Verifica tu inscripción al congreso</h2>
            <p class="mt-3 text-slate-300">
              Escribe tu documento y <strong class="text-white">el correo con el que te inscribiste al congreso</strong>. Solo pueden inscribirse a las ponencias quienes tienen su pago aprobado.
            </p>

            <div class="mt-6 grid gap-5 sm:grid-cols-[12rem_1fr]">
              <div>
                <label for="tipo-documento" class="campo-label">Documento</label>
                <select id="tipo-documento" v-model="form.tipoDocumento" class="campo">
                  <option v-for="tipo in documentTypes" :key="tipo.value" :value="tipo.value">{{ tipo.label }}</option>
                </select>
              </div>
              <div>
                <label for="numero-documento" class="campo-label">Número de documento <span aria-hidden="true">*</span></label>
                <input
                  id="numero-documento"
                  v-model="form.numeroDocumento"
                  class="campo font-mono tracking-wider"
                  :inputmode="form.tipoDocumento === 'DNI' ? 'numeric' : 'text'"
                  :placeholder="form.tipoDocumento === 'DNI' ? '8 dígitos' : '9 a 12 letras o dígitos'"
                  autocomplete="off"
                  :aria-invalid="errores.numeroDocumento ? true : undefined"
                >
                <p v-if="errores.numeroDocumento" class="campo-error" role="alert">{{ errores.numeroDocumento }}</p>
              </div>
              <div class="sm:col-span-2">
                <label for="correo" class="campo-label">Correo del congreso <span aria-hidden="true">*</span></label>
                <input id="correo" v-model="form.correo" type="email" class="campo" maxlength="191" autocomplete="email" placeholder="el correo con el que te inscribiste" :aria-invalid="errores.correo ? true : undefined">
                <p v-if="errores.correo" class="campo-error" role="alert">{{ errores.correo }}</p>
              </div>
            </div>

            <div v-if="errorVerificacion" class="mt-6 flex items-start gap-3 rounded-2xl border border-red-300/30 bg-red-400/10 p-4 text-sm leading-relaxed text-red-100" role="alert">
              <Icon name="heroicons:exclamation-circle" class="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{{ errorVerificacion }}</span>
            </div>

            <div v-if="verificacion" class="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-4" role="status">
              <Icon name="heroicons:check-circle" class="mt-0.5 h-6 w-6 shrink-0 text-emerald-300" aria-hidden="true" />
              <div class="text-sm leading-relaxed text-slate-200">
                <p class="font-semibold text-white">Hola, {{ primerNombreVerificado }}: tu inscripción al congreso está aprobada.</p>
                <p class="mt-1">
                  Asistes de forma <strong class="text-white">{{ etiquetaModoAsistencia(verificacion.modoAsistencia).toLowerCase() }}</strong><template v-if="verificacion.tipo"> · {{ verificacion.tipo }}</template>.
                  <template v-if="modo === 'VIRTUAL'">Como asistente virtual no tienes límite de cupo: puedes elegir cualquier ponencia.</template>
                  <template v-else>Las ponencias presenciales tienen cupos limitados.</template>
                </p>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap items-center gap-4">
              <button type="submit" class="btn btn-primary" :disabled="verificando">
                <Icon v-if="verificando" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" aria-hidden="true" />
                {{ verificando ? 'Verificando…' : verificacion ? 'Verificar de nuevo' : 'Verificar mi inscripción' }}
              </button>
              <p class="text-xs text-slate-400">
                ¿No recuerdas el correo o tu pago sigue en revisión? Escríbenos desde
                <NuxtLink to="/contacto" class="underline underline-offset-2 hover:text-white">Contacto</NuxtLink>.
              </p>
            </div>
          </form>
        </section>

        <!-- Aviso mientras no se verifica -->
        <section v-if="!accesoLibre && !verificacion" class="mx-auto max-w-3xl px-6 py-14 text-center text-slate-300" role="status">
          <Icon name="heroicons:lock-closed" class="mx-auto h-9 w-9 text-primary-400" aria-hidden="true" />
          <p class="mt-3 font-semibold text-white">Verifica tu inscripción para ver y elegir las ponencias.</p>
          <p class="mt-1 text-sm">Los cupos de las ponencias presenciales dependen de cómo asistes al congreso.</p>
        </section>

        <!-- Elección -->
        <section v-if="accesoLibre || verificacion" class="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16 2xl:max-w-[1600px]" aria-labelledby="titulo-eleccion">
          <div class="mb-9 max-w-3xl">
            <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Paso {{ accesoLibre ? 1 : 2 }}</p>
            <h2 id="titulo-eleccion" class="mt-2 text-3xl font-bold tracking-tight">Elige tus ponencias</h2>
            <p class="mt-3 flex items-start gap-3 rounded-2xl border border-primary-400/25 bg-primary-400/[.07] p-4 leading-relaxed text-slate-200">
              <Icon name="heroicons:information-circle" class="mt-0.5 h-6 w-6 shrink-0 text-primary-300" aria-hidden="true" />
              <span>Las ponencias de cada día se dictan <strong class="text-white">al mismo tiempo</strong>: elige una por horario. Al elegirla se ocultan las demás; púlsala de nuevo para cambiarla.</span>
            </p>
          </div>

          <div class="mb-10 max-w-xl" role="search">
            <label for="buscar-ponencia" class="campo-label">Buscar ponencia</label>
            <div class="relative">
              <Icon name="heroicons:magnifying-glass" class="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="buscar-ponencia"
                v-model="busqueda"
                type="search"
                class="campo buscador"
                placeholder="Tema, ponente, ambiente o día…"
                autocomplete="off"
                enterkeyhint="search"
              >
              <button
                v-if="busqueda"
                type="button"
                class="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-300 hover:bg-white/10 hover:text-white"
                aria-label="Borrar búsqueda"
                @click="busqueda = ''"
              >
                <Icon name="heroicons:x-mark" class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p class="mt-2 min-h-5 text-xs text-slate-400" role="status" aria-live="polite">{{ resumenBusqueda }}</p>
          </div>

          <div class="space-y-12">
            <section v-for="{ dia, visibles, resumen } in vistaDias" :key="dia.fecha" :aria-labelledby="`dia-${dia.fecha}`">
              <div class="mb-5 flex flex-wrap items-end justify-between gap-3 border-l-4 border-primary-400 pl-4">
                <h3 :id="`dia-${dia.fecha}`" tabindex="-1" class="scroll-mt-32 text-2xl font-extrabold tracking-tight outline-none">{{ dia.etiqueta }}</h3>
                <p class="text-sm text-slate-400">{{ resumen }}</p>
              </div>
              <p v-if="!visibles.length" class="rounded-2xl border border-white/10 bg-white/[.03] p-5 text-slate-300" role="status">
                Ninguna ponencia de este día coincide con «{{ busqueda.trim() }}».
              </p>
              <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <label
                  v-for="ponencia in visibles"
                  :key="ponencia.id"
                  :for="`ponencia-${ponencia.id}`"
                  class="opcion flex h-full flex-col rounded-3xl border p-5"
                  :class="{ 'is-selected': estaElegida(ponencia), 'is-disabled': Boolean(motivo(ponencia)) }"
                >
                  <input
                    :id="`ponencia-${ponencia.id}`"
                    type="checkbox"
                    class="sr-only"
                    :checked="estaElegida(ponencia)"
                    :disabled="Boolean(motivo(ponencia)) && !estaElegida(ponencia)"
                    @change="alternarYAvanzar(ponencia)"
                  >
                  <span class="flex items-start justify-between gap-3">
                    <span class="check" aria-hidden="true"><Icon v-if="estaElegida(ponencia)" name="heroicons:check" class="h-4 w-4" /></span>
                    <span class="nivel" :class="`nivel-${motivo(ponencia) ? 'agotada' : nivel(ponencia)}`">
                      {{ motivo(ponencia) === 'DE_PAGO' ? 'De pago' : cupos(ponencia) }}
                    </span>
                  </span>
                  <span class="mt-4 flex-1 text-lg font-bold leading-snug text-white">{{ ponencia.tema }}</span>
                  <span class="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
                    <span class="inline-flex items-center gap-1.5"><Icon name="heroicons:clock" class="h-4 w-4 text-primary-400" aria-hidden="true" />{{ rangoHorario(ponencia.horaInicio, ponencia.horaFin) }} · {{ duracionTexto(ponencia.duracionMin) }}</span>
                    <span class="inline-flex items-center gap-1.5"><Icon :name="ponencia.modalidad === 'VIRTUAL' ? 'heroicons:video-camera' : 'heroicons:map-pin'" class="h-4 w-4 text-primary-400" aria-hidden="true" />{{ ponencia.ambiente }}<template v-if="ponencia.modalidad === 'VIRTUAL'"> · Virtual</template></span>
                  </span>
                  <span class="mt-4 flex items-center gap-3 border-t border-white/10 pt-4">
                    <img v-if="ponencia.ponente.foto" :src="ponencia.ponente.foto" alt="" width="48" height="48" loading="lazy" class="h-10 w-10 shrink-0 rounded-full border border-white/20 object-cover object-top">
                    <span v-else class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-sm font-bold text-primary-200" aria-hidden="true">{{ iniciales(ponencia.ponente.nombre) }}</span>
                    <span class="min-w-0 text-sm">
                      <span class="block text-[.68rem] font-semibold uppercase tracking-[.14em] text-slate-400">Ponente<template v-if="ponencia.ponente.externo"> externo</template></span>
                      <span class="block font-semibold leading-snug text-slate-100">{{ ponencia.ponente.nombre }}</span>
                    </span>
                  </span>
                  <span v-if="estaElegida(ponencia)" class="mt-3 text-xs font-semibold text-primary-300">Elegida · púlsala para quitarla y ver las demás.</span>
                  <span v-else-if="motivo(ponencia)" class="mt-3 text-xs font-semibold text-amber-200">{{ TEXTO_NO_DISPONIBLE[motivo(ponencia)!] }}</span>
                  <span v-else-if="modo === 'VIRTUAL' && ponencia.llena" class="mt-3 text-xs font-semibold text-sky-200">El aforo presencial está completo; como asistente virtual puedes inscribirte.</span>
                </label>
              </div>
            </section>
          </div>
        </section>

        <!-- Datos (acceso libre) o confirmación (congresista verificado) -->
        <section v-if="accesoLibre || verificacion" class="border-t border-white/10 bg-[#03172d] px-6 py-12 lg:px-8 lg:py-16" aria-labelledby="titulo-datos">
          <form class="mx-auto max-w-3xl" novalidate @submit.prevent="enviar">
            <p class="text-xs font-bold uppercase tracking-[.2em] text-primary-300">Paso {{ accesoLibre ? 2 : 3 }}</p>
            <h2 id="titulo-datos" tabindex="-1" class="mt-2 scroll-mt-40 text-3xl font-bold tracking-tight outline-none">{{ accesoLibre ? 'Tus datos' : 'Confirma tu inscripción' }}</h2>
            <p class="mt-3 text-slate-300">
              <template v-if="accesoLibre">Solo necesitas tu documento. Con tu DNI completamos tus nombres automáticamente; el correo y el celular son opcionales.</template>
              <template v-else>Te inscribimos con los datos de tu inscripción al congreso, de forma {{ modo ? etiquetaModoAsistencia(modo).toLowerCase() : 'presencial' }}.</template>
            </p>

            <div class="mt-6 rounded-2xl border border-white/10 bg-white/[.03] p-4" aria-live="polite">
              <p class="text-sm font-semibold text-slate-300">Tu elección ({{ elegidas.length }})</p>
              <p v-if="!elegidas.length" class="mt-1 text-sm text-slate-400">Aún no elegiste ninguna ponencia.</p>
              <ul v-else class="mt-2 space-y-2">
                <li v-for="ponencia in elegidas" :key="ponencia.id" class="flex items-start justify-between gap-3 text-sm">
                  <span><strong class="text-white">{{ etiquetaDia(ponencia.fecha) }} · {{ rangoHorario(ponencia.horaInicio, ponencia.horaFin) }}</strong> — {{ ponencia.tema }} ({{ ponencia.ambiente }})</span>
                  <button type="button" class="shrink-0 text-xs font-semibold text-primary-300 underline-offset-2 hover:underline" @click="alternar(ponencia)">Quitar</button>
                </li>
              </ul>
              <p v-if="errores.ponencias" class="campo-error mt-2" role="alert">{{ errores.ponencias }}</p>
            </div>

            <template v-if="accesoLibre">
              <div class="mt-6 grid gap-5 sm:grid-cols-[12rem_1fr]">
                <div>
                  <label for="tipo-documento" class="campo-label">Documento</label>
                  <select id="tipo-documento" v-model="form.tipoDocumento" class="campo">
                    <option v-for="tipo in documentTypes" :key="tipo.value" :value="tipo.value">{{ tipo.label }}</option>
                  </select>
                </div>
                <div>
                  <label for="numero-documento" class="campo-label">Número de documento <span aria-hidden="true">*</span></label>
                  <input
                    id="numero-documento"
                    v-model="form.numeroDocumento"
                    class="campo font-mono tracking-wider"
                    :inputmode="form.tipoDocumento === 'DNI' ? 'numeric' : 'text'"
                    :placeholder="form.tipoDocumento === 'DNI' ? '8 dígitos' : '9 a 12 letras o dígitos'"
                    autocomplete="off"
                    :aria-invalid="errores.numeroDocumento ? true : undefined"
                    :aria-describedby="consulta.mensaje ? 'consulta-dni' : undefined"
                  >
                  <p v-if="errores.numeroDocumento" class="campo-error" role="alert">{{ errores.numeroDocumento }}</p>
                  <p id="consulta-dni" class="mt-1 min-h-5 text-xs" :class="consulta.estado === 'ENCONTRADO' ? 'text-emerald-300' : consulta.estado === 'FALLO' ? 'text-amber-300' : 'text-slate-400'" role="status">{{ consulta.mensaje }}</p>
                </div>
                <div>
                  <label for="nombres" class="campo-label">Nombres <span v-if="nombresObligatorios" aria-hidden="true">*</span></label>
                  <input id="nombres" v-model="form.nombres" class="campo" :class="{ 'campo-bloqueado': nombresConsultados }" :readonly="nombresConsultados" maxlength="120" autocomplete="given-name" :aria-invalid="errores.nombres ? true : undefined">
                  <p v-if="errores.nombres" class="campo-error" role="alert">{{ errores.nombres }}</p>
                </div>
                <div>
                  <label for="apellidos" class="campo-label">Apellidos <span v-if="nombresObligatorios" aria-hidden="true">*</span></label>
                  <input id="apellidos" v-model="form.apellidos" class="campo" :class="{ 'campo-bloqueado': nombresConsultados }" :readonly="nombresConsultados" maxlength="120" autocomplete="family-name" :aria-invalid="errores.apellidos ? true : undefined">
                  <p v-if="errores.apellidos" class="campo-error" role="alert">{{ errores.apellidos }}</p>
                </div>
                <div>
                  <label for="correo" class="campo-label">Correo <span class="font-normal text-slate-400">(opcional)</span></label>
                  <input id="correo" v-model="form.correo" type="email" class="campo" maxlength="191" autocomplete="email" :aria-invalid="errores.correo ? true : undefined">
                  <p v-if="errores.correo" class="campo-error" role="alert">{{ errores.correo }}</p>
                </div>
                <div>
                  <label for="celular" class="campo-label">Celular <span class="font-normal text-slate-400">(opcional)</span></label>
                  <input id="celular" v-model="form.celular" type="tel" inputmode="tel" class="campo" maxlength="20" placeholder="987654321" autocomplete="tel" :aria-invalid="errores.celular ? true : undefined">
                  <p v-if="errores.celular" class="campo-error" role="alert">{{ errores.celular }}</p>
                </div>
              </div>

              <fieldset class="mt-6">
                <legend class="campo-label">¿Perteneces a la UNDC? <span class="font-normal text-slate-400">(opcional)</span></legend>
                <div class="mt-2 flex flex-wrap gap-3">
                  <label v-for="opcion in PROCEDENCIAS" :key="opcion.valor" class="radio-chip" :class="{ activo: form.procedencia === opcion.valor }">
                    <input v-model="form.procedencia" type="radio" name="procedencia" :value="opcion.valor" class="sr-only">
                    {{ opcion.etiqueta }}
                  </label>
                  <button v-if="form.procedencia" type="button" class="text-xs font-semibold text-primary-300 underline-offset-2 hover:underline" @click="form.procedencia = ''">Quitar</button>
                </div>
              </fieldset>
            </template>

            <div v-if="errorEnvio" class="mt-6 flex items-start gap-3 rounded-2xl border border-red-300/30 bg-red-400/10 p-4 text-sm leading-relaxed text-red-100" role="alert">
              <Icon name="heroicons:exclamation-circle" class="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>{{ errorEnvio }}</span>
            </div>

            <div class="mt-8 flex flex-wrap items-center gap-4">
              <button type="submit" class="btn btn-primary" :disabled="enviando">
                <Icon v-if="enviando" name="heroicons:arrow-path" class="h-5 w-5 animate-spin" aria-hidden="true" />
                {{ enviando ? 'Inscribiendo…' : `Inscribirme${elegidas.length ? ` (${elegidas.length})` : ''}` }}
              </button>
              <p class="text-xs text-slate-400">
                Usamos tus datos solo para controlar el ingreso a las ponencias. Más en la
                <NuxtLink to="/privacidad" class="underline underline-offset-2 hover:text-white">política de privacidad</NuxtLink>.
              </p>
            </div>
          </form>
        </section>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ApiExito } from '~/types/evento'
import type { InscripcionPonenciasRespuesta, ModoAsistencia, PonenciaEspecializadaPublica, VerificacionCongresista } from '~/types/ponencias-especializadas'
import { mensajeFallaConsultaDni } from '~/utils/consulta-dni'
import {
  alternarSeleccion,
  cuerpoInscripcion,
  cuerpoVerificacion,
  depurarSeleccion,
  destinoTrasElegir,
  esErrorDeCongreso,
  etiquetaModoAsistencia,
  filtrarPonencias,
  formularioVacio,
  mensajeErrorInscripcionPonencias,
  motivoNoDisponible,
  nivelDeCupos,
  normalizarDocumento,
  pideNombres,
  ponenciasVisibles,
  programaNoDisponible,
  TEXTO_NO_DISPONIBLE,
  textoCupos,
  validarFormulario,
  validarVerificacion,
  type ErroresFormulario,
} from '~/utils/inscripcion-ponencias'
import { duracionTexto, etiquetaDia, rangoHorario } from '~/utils/ponencias-especializadas'
import { rutasSitio } from '~/utils/rutas-sitio'

useSeoMeta({
  title: 'Inscripción a ponencias especializadas | VIII CIISIC 2026',
  description: 'Inscríbete gratis a las ponencias especializadas del VIII CIISIC 2026 (27 y 28 de octubre): verifica tu inscripción al congreso, elige tus ponencias y lleva tu documento.',
  ogTitle: 'Inscripción a ponencias especializadas | VIII CIISIC 2026',
  ogDescription: 'Verifica tu inscripción al congreso, elige tus ponencias especializadas y regístrate con tu DNI.',
})

const PROCEDENCIAS = [
  { valor: 'INTERNO', etiqueta: 'Soy de la UNDC' },
  { valor: 'EXTERNO', etiqueta: 'Soy externo' },
] as const

const { request } = useApi()
const { ponencias, dias, accesoLibre, error, cargando, recargar } = usePonenciasEspecializadas()
const { documentTypes, consultDni } = useConsultation()

const form = reactive(formularioVacio())
const seleccion = ref<number[]>([])
const busqueda = ref('')
const errores = ref<ErroresFormulario>({})
const errorEnvio = ref('')
const enviando = ref(false)
const resultado = ref<InscripcionPonenciasRespuesta | null>(null)
const bloqueResultado = ref<HTMLElement | null>(null)
/** `NAMES_REQUIRED`: el documento no trajo nombres y hay que escribirlos (solo con el acceso libre). */
const nombresManuales = ref(false)

/** Verificación previa (sin acceso libre): el documento y el correo son de un congresista con el pago aprobado. */
const verificacion = ref<VerificacionCongresista | null>(null)
const verificando = ref(false)
const errorVerificacion = ref('')
/** Con qué documento y correo se verificó: si cambian, la verificación y la elección dejan de valer. */
let verificadoCon = ''

const consulta = ref<{ estado: 'INICIAL' | 'CONSULTANDO' | 'ENCONTRADO' | 'FALLO', numero: string, mensaje: string }>({ estado: 'INICIAL', numero: '', mensaje: '' })
let turnoConsulta = 0

const noDisponible = computed(() => programaNoDisponible(error.value))
/** Cómo asiste quien se verificó; `null` con el acceso libre (no se distingue). */
const modo = computed<ModoAsistencia | null>(() => (accesoLibre.value ? null : verificacion.value?.modoAsistencia ?? null))
const elegidas = computed(() => ponencias.value.filter(p => seleccion.value.includes(p.id)))
const nombresConsultados = computed(() => form.tipoDocumento === 'DNI' && consulta.value.estado === 'ENCONTRADO' && consulta.value.numero === form.numeroDocumento)
const nombresObligatorios = computed(() =>
  form.tipoDocumento === 'CE' || nombresManuales.value || (form.tipoDocumento === 'DNI' && consulta.value.estado === 'FALLO' && consulta.value.numero === form.numeroDocumento))
const primerNombre = computed(() => resultado.value?.asistente.nombres.split(' ')[0] ?? '')
const primerNombreVerificado = computed(() => verificacion.value?.nombres.split(' ')[0] ?? '')

const buscando = computed(() => busqueda.value.trim().length > 0)
const resumenBusqueda = computed(() => {
  if (!buscando.value) return ''
  const coinciden = filtrarPonencias(ponencias.value, busqueda.value).length
  return coinciden
    ? `${coinciden} de ${ponencias.value.length} ponencias coinciden con tu búsqueda.`
    : `No encontramos ponencias con «${busqueda.value.trim()}».`
})

/** Cada día con lo que se ve de él: al elegir una ponencia se ocultan las demás de su horario. */
const vistaDias = computed(() => dias.value.map((dia) => {
  const visibles = ponenciasVisibles(dia.ponencias, seleccion.value, ponencias.value, busqueda.value)
  const elegidasDelDia = dia.ponencias.filter(p => seleccion.value.includes(p.id)).length
  const total = dia.ponencias.length
  const resumen = elegidasDelDia
    ? `Elegiste ${elegidasDelDia} de ${total} · las demás están ocultas`
    : buscando.value ? `${visibles.length} de ${total} ponencias` : `${total} ponencias`
  return { dia, visibles, resumen }
}))

// El aforo es presencial: para un congresista virtual las ponencias llenas siguen disponibles
const motivo = (ponencia: PonenciaEspecializadaPublica) => motivoNoDisponible(ponencia, modo.value)
const cupos = (ponencia: PonenciaEspecializadaPublica) => textoCupos(ponencia, modo.value)
const nivel = (ponencia: PonenciaEspecializadaPublica) => nivelDeCupos(ponencia, modo.value)

const estaElegida = (ponencia: PonenciaEspecializadaPublica) => seleccion.value.includes(ponencia.id)
const alternar = (ponencia: PonenciaEspecializadaPublica) => {
  seleccion.value = alternarSeleccion(seleccion.value, ponencia, ponencias.value, modo.value)
  errores.value = { ...errores.value, ponencias: undefined }
}

/** Elegir oculta las demás del horario y pasa al siguiente día pendiente o a los datos; quitar solo las vuelve a mostrar. */
async function alternarYAvanzar(ponencia: PonenciaEspecializadaPublica) {
  const eraElegida = estaElegida(ponencia)
  alternar(ponencia)
  if (eraElegida || !estaElegida(ponencia)) return
  await nextTick()
  const destino = document.getElementById(destinoTrasElegir(dias.value, seleccion.value, ponencia.fecha, modo.value))
  if (!destino) return
  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  destino.scrollIntoView({ behavior: sinMovimiento ? 'auto' : 'smooth', block: 'start' })
  destino.focus({ preventScroll: true })
}
const iniciales = (nombre: string) => nombre.replace(/^(dr|dra|mg|m\.sc|ph\.d)\.?\s+/i, '').split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase() ?? '').join('')

// Los cupos del HTML pueden tener hasta unos segundos de antigüedad: se renuevan al abrir la página
onMounted(async () => {
  await recargar()
  seleccion.value = depurarSeleccion(seleccion.value, ponencias.value, modo.value)
})

const claveVerificada = () => `${form.tipoDocumento}|${form.numeroDocumento}|${form.correo.trim().toLowerCase()}`

// Número de documento: solo los caracteres válidos; con el acceso libre y un DNI completo se consultan los nombres
watch(() => [form.tipoDocumento, form.numeroDocumento] as const, ([tipo, numero]) => {
  const limpio = normalizarDocumento(tipo, numero)
  if (limpio !== numero) {
    form.numeroDocumento = limpio
    return
  }
  errores.value = { ...errores.value, numeroDocumento: undefined }
  if (consulta.value.estado !== 'INICIAL' && (tipo !== 'DNI' || consulta.value.numero !== limpio)) {
    turnoConsulta++
    if (consulta.value.estado === 'ENCONTRADO') Object.assign(form, { nombres: '', apellidos: '' })
    consulta.value = { estado: 'INICIAL', numero: '', mensaje: '' }
    nombresManuales.value = false
  }
  if (accesoLibre.value && tipo === 'DNI' && /^\d{8}$/.test(limpio)) buscarNombres(limpio)
})

// Cambiar el documento o el correo después de verificar obliga a verificar de nuevo (y vacía la elección)
watch(() => [form.tipoDocumento, form.numeroDocumento, form.correo] as const, () => {
  errores.value = { ...errores.value, correo: undefined }
  if (verificacion.value && claveVerificada() !== verificadoCon) {
    verificacion.value = null
    seleccion.value = []
  }
})

async function buscarNombres(numero: string) {
  const turno = ++turnoConsulta
  consulta.value = { estado: 'CONSULTANDO', numero, mensaje: 'Buscando tus datos…' }
  try {
    const persona = await consultDni(numero)
    if (turno !== turnoConsulta) return
    if (!persona) {
      consulta.value = { estado: 'FALLO', numero, mensaje: mensajeFallaConsultaDni({ statusCode: 404, code: 'DOCUMENT_NOT_FOUND' }, numero) }
      return
    }
    Object.assign(form, persona)
    errores.value = { ...errores.value, nombres: undefined, apellidos: undefined }
    consulta.value = { estado: 'ENCONTRADO', numero, mensaje: 'Encontramos tus datos.' }
  } catch (e) {
    if (turno === turnoConsulta) consulta.value = { estado: 'FALLO', numero, mensaje: mensajeFallaConsultaDni(normalizeApiError(e), numero) }
  }
}

function enfocarPrimerError() {
  const orden: Array<[keyof ErroresFormulario, string]> = [['ponencias', 'titulo-eleccion'], ['numeroDocumento', 'numero-documento'], ['nombres', 'nombres'], ['apellidos', 'apellidos'], ['correo', 'correo'], ['celular', 'celular']]
  const primero = orden.find(([campo]) => errores.value[campo])
  if (primero) nextTick(() => document.getElementById(primero[1])?.focus({ preventScroll: false }))
}

/** Comprueba el documento y el correo del congreso y dice cómo asiste la persona (presencial o virtual). */
async function verificar() {
  if (verificando.value) return
  errorVerificacion.value = ''
  const faltas = validarVerificacion(form)
  errores.value = { ...errores.value, numeroDocumento: faltas.numeroDocumento, correo: faltas.correo }
  if (faltas.numeroDocumento || faltas.correo) return enfocarPrimerError()
  verificando.value = true
  try {
    const respuesta = await request<ApiExito<VerificacionCongresista>>(rutasSitio.verificacionPonenciasEspecializadas, {
      method: 'POST',
      body: cuerpoVerificacion(form),
      timeout: 15000,
    })
    verificacion.value = respuesta.data
    verificadoCon = claveVerificada()
    seleccion.value = []
    // Los cupos pueden haber cambiado mientras se escribía
    await recargar()
    await nextTick()
    document.getElementById('titulo-eleccion')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
  } catch (e) {
    verificacion.value = null
    const falla = normalizeApiError(e)
    errorVerificacion.value = mensajeErrorInscripcionPonencias(falla)
    // El evento pasó a acceso libre: se vuelve a leer el programa para mostrar el formulario sencillo
    if (falla.code === 'FREE_ACCESS_ENABLED') await recargar()
  } finally {
    verificando.value = false
  }
}

async function enviar() {
  if (enviando.value) return
  errorEnvio.value = ''
  errores.value = validarFormulario(form, seleccion.value, { nombresObligatorios: nombresObligatorios.value, accesoLibre: accesoLibre.value })
  if (Object.keys(errores.value).length) return enfocarPrimerError()
  enviando.value = true
  try {
    const respuesta = await request<ApiExito<InscripcionPonenciasRespuesta>>(rutasSitio.inscripcionPonenciasEspecializadas, {
      method: 'POST',
      body: cuerpoInscripcion(form, seleccion.value, { accesoLibre: accesoLibre.value }),
      timeout: 20000,
    })
    resultado.value = respuesta.data
    recargar()
    await nextTick()
    bloqueResultado.value?.focus()
  } catch (e) {
    const falla = normalizeApiError(e)
    errorEnvio.value = mensajeErrorInscripcionPonencias(falla)
    if (pideNombres(falla)) {
      nombresManuales.value = true
      nextTick(() => document.getElementById('nombres')?.focus())
    }
    // El pago dejó de estar aprobado o el evento cambió de acceso: se vuelve a verificar desde el principio
    if (esErrorDeCongreso(falla) || falla.code === 'VALIDATION_ERROR') {
      verificacion.value = null
      errorVerificacion.value = errorEnvio.value
      await recargar()
    }
    // Un cupo, un cruce o una ponencia que cambió: se vuelve a leer el programa y se depura la elección
    if (['TALK_FULL', 'TALK_NOT_FOUND', 'TALK_ENDED', 'SCHEDULE_CONFLICT', 'PAID_TALK_UNAVAILABLE'].includes(falla.code)) {
      await recargar()
      seleccion.value = depurarSeleccion(seleccion.value, ponencias.value, modo.value)
    }
  } finally {
    enviando.value = false
  }
}

function nuevaInscripcion() {
  resultado.value = null
  seleccion.value = []
  errorEnvio.value = ''
  errorVerificacion.value = ''
  errores.value = {}
  nombresManuales.value = false
  verificacion.value = null
  verificadoCon = ''
  turnoConsulta++
  consulta.value = { estado: 'INICIAL', numero: '', mensaje: '' }
  Object.assign(form, formularioVacio())
  busqueda.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.ins-hero { background: radial-gradient(circle at 50% 0%, #087dd83d, transparent 48%), #041d39; }
.ins-grid { opacity: .25; background-image: linear-gradient(#1d7fb43d 1px, transparent 1px), linear-gradient(90deg, #1d7fb43d 1px, transparent 1px); background-size: 64px 64px; mask-image: linear-gradient(to bottom, black, transparent); }
.summary-chip { display: inline-flex; align-items: center; gap: .5rem; border: 1px solid #ffffff1a; border-radius: 9999px; background: #ffffff08; padding: .55rem .9rem; color: #cbd5e1; transition: border-color .2s ease, color .2s ease; }
.listo-card { background: linear-gradient(150deg, #0a3157d9, #062541f2); box-shadow: 0 20px 55px #020f2033; }
.listo-card:focus { outline: none; }

.opcion { cursor: pointer; border-color: #ffffff1a; background: linear-gradient(150deg, #0a3157d9, #062541f2); box-shadow: 0 20px 55px #020f2033; transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; animation: aparece .3s ease both; }
@keyframes aparece { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.opcion:hover { transform: translateY(-3px); border-color: #22d3ee59; }
.opcion:has(input:focus-visible) { outline: 2px solid #22d3ee; outline-offset: 3px; }
.opcion.is-selected { border-color: #22d3ee; box-shadow: 0 0 0 1px #22d3ee, 0 20px 55px #020f2052; }
.opcion.is-disabled:not(.is-selected) { cursor: not-allowed; opacity: .6; }
.opcion.is-disabled:not(.is-selected):hover { transform: none; border-color: #ffffff1a; }
.check { display: inline-flex; height: 1.5rem; width: 1.5rem; flex-shrink: 0; align-items: center; justify-content: center; border-radius: .5rem; border: 2px solid #ffffff40; color: #041d39; transition: background-color .2s ease, border-color .2s ease; }
.is-selected .check { background: #22d3ee; border-color: #22d3ee; }
.nivel { border-radius: 9999px; padding: .2rem .7rem; font-size: .72rem; font-weight: 700; letter-spacing: .02em; }
.nivel-libre, .nivel-ok { background: #34d39926; color: #6ee7b7; }
.nivel-poco { background: #fbbf2426; color: #fcd34d; }
.nivel-agotada { background: #f8717126; color: #fca5a5; }

.campo-label { display: block; margin-bottom: .4rem; font-size: .875rem; font-weight: 600; color: #e2e8f0; }
.campo { width: 100%; border-radius: .75rem; border: 1px solid #ffffff26; background: #ffffff0d; padding: .7rem .9rem; color: #fff; transition: border-color .2s ease, background-color .2s ease; }
.campo::placeholder { color: #94a3b8; }
.campo:focus { outline: none; border-color: #22d3ee; background: #ffffff14; }
.campo[aria-invalid='true'] { border-color: #f87171; }
.buscador { padding-left: 2.9rem; padding-right: 2.9rem; }
.buscador::-webkit-search-cancel-button { display: none; }
.campo-bloqueado { opacity: .75; cursor: default; }
.campo-error { margin-top: .35rem; font-size: .8rem; color: #fca5a5; }
select.campo option { color: #0f172a; }
.radio-chip { cursor: pointer; border: 1px solid #ffffff26; border-radius: 9999px; padding: .5rem 1rem; font-size: .9rem; color: #cbd5e1; transition: border-color .2s ease, background-color .2s ease; }
.radio-chip:hover { border-color: #22d3ee80; }
.radio-chip.activo { border-color: #22d3ee; background: #22d3ee1f; color: #fff; }
.radio-chip:has(input:focus-visible) { outline: 2px solid #22d3ee; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .opcion, .check, .campo, .radio-chip, .summary-chip { transition: none; } .opcion { animation: none; } .opcion:hover { transform: none; } }
</style>
