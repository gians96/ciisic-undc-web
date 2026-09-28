<template>
  <section id="registrar-paper" class="mx-auto max-w-4xl scroll-mt-28 px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="paper-form-title">
    <div class="rounded-2xl border border-primary-400/25 bg-[#082c52] p-5 sm:p-8">
      <h2 id="paper-form-title" class="text-3xl font-bold text-white">Registrar paper</h2>
      <p class="mt-3 text-slate-300">Completa los datos de los autores y adjunta tu artículo en PDF. Máximo cuatro autores en total. Todos los campos son obligatorios.</p>

      <div v-if="receipt" role="status" class="mt-6 rounded-xl border border-primary-400/40 bg-primary-400/10 p-5">
        <h3 class="text-xl font-semibold text-primary-300">Paper recibido</h3>
        <p class="mt-2 text-white">Tu artículo se guardó correctamente. Conserva este código de recepción:</p>
        <p class="mt-3 break-all font-mono text-primary-200">{{ receipt }}</p>
        <p class="mt-3 text-sm text-slate-300">La recepción no implica la aceptación del artículo.</p>
        <button type="button" class="mt-5 font-semibold text-primary-300 underline underline-offset-4" @click="receipt = ''">Registrar otro paper</button>
      </div>

      <form v-else class="mt-8 space-y-7" :aria-busy="submitting" @submit.prevent="submit">
        <fieldset :disabled="submitting" class="space-y-6 disabled:opacity-70">
          <legend class="mb-4 text-lg font-semibold text-white">Autor principal</legend>
          <div class="grid gap-4 sm:grid-cols-2">
            <div><label for="paper-first-name">Nombres</label><input id="paper-first-name" v-model="mainAuthor.firstName" required maxlength="120" autocomplete="given-name"></div>
            <div><label for="paper-last-name">Apellidos</label><input id="paper-last-name" v-model="mainAuthor.lastName" required maxlength="120" autocomplete="family-name"></div>
          </div>
          <div><label for="paper-university">Universidad del autor principal</label><input id="paper-university" v-model="mainAuthor.university" required maxlength="200" autocomplete="organization"></div>
        </fieldset>

        <fieldset :disabled="submitting" class="space-y-4">
          <legend class="mb-3 text-lg font-semibold text-white">Coautores ({{ coauthors.length }} de 3)</legend>
          <p class="text-sm text-slate-300">Si eres el único autor, no necesitas agregar coautores.</p>
          <fieldset v-for="(author, index) in coauthors" :key="author.key" class="rounded-xl border border-white/15 p-4">
            <legend class="px-2 font-semibold text-primary-300">Coautor {{ index + 1 }}</legend>
            <div class="grid gap-4 sm:grid-cols-2">
              <div><label :for="`coauthor-first-${author.key}`">Nombres</label><input :id="`coauthor-first-${author.key}`" v-model="author.firstName" required maxlength="120" autocomplete="off"></div>
              <div><label :for="`coauthor-last-${author.key}`">Apellidos</label><input :id="`coauthor-last-${author.key}`" v-model="author.lastName" required maxlength="120" autocomplete="off"></div>
              <div class="sm:col-span-2"><label :for="`coauthor-university-${author.key}`">Universidad</label><input :id="`coauthor-university-${author.key}`" v-model="author.university" required maxlength="200" autocomplete="off"></div>
            </div>
            <button type="button" class="mt-4 text-sm font-semibold text-primary-300 underline underline-offset-4" :aria-label="`Quitar coautor ${index + 1}`" @click="coauthors.splice(index, 1)">Quitar coautor</button>
          </fieldset>
          <button type="button" class="rounded-lg border border-primary-400 px-4 py-2 font-semibold text-primary-300 hover:bg-primary-400/10 disabled:cursor-not-allowed disabled:opacity-50" :disabled="coauthors.length >= 3" @click="addCoauthor">Agregar coautor</button>
        </fieldset>

        <fieldset :disabled="submitting" class="space-y-5">
          <legend class="mb-4 text-lg font-semibold text-white">Artículo</legend>
          <div><label for="paper-title">Título del paper</label><textarea id="paper-title" v-model="title" required maxlength="300" rows="3" /></div>
          <div>
            <label for="paper-file">Archivo PDF</label>
            <input id="paper-file" ref="fileInput" type="file" accept=".pdf,application/pdf" required aria-describedby="paper-file-help" @change="selectFile">
            <p id="paper-file-help" class="mt-2 text-sm text-slate-300">Un archivo PDF de hasta 5 MB. Para la revisión a doble ciego, no incluyas nombres ni universidades dentro del documento.</p>
            <p v-if="pdf" class="mt-2 break-all text-sm text-primary-300">{{ pdf.name }} · {{ (pdf.size / 1024 / 1024).toFixed(2) }} MB</p>
          </div>
        </fieldset>

        <p v-if="error" role="alert" class="rounded-lg border border-red-400/40 bg-red-950/40 p-4 text-red-200">{{ error }}</p>
        <button type="submit" :disabled="submitting" class="btn btn-primary w-full disabled:cursor-wait disabled:opacity-60 sm:w-auto">{{ submitting ? 'Enviando paper…' : 'Enviar paper' }}</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue'
import { validatePaperFile, type PaperAuthor } from '~/utils/papers'

const { request } = useApi()
const emptyAuthor = (): PaperAuthor => ({ firstName: '', lastName: '', university: '' })
const mainAuthor = reactive(emptyAuthor())
const coauthors = ref<(PaperAuthor & { key: number })[]>([])
let nextKey = 0
const title = ref('')
const pdf = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const submitting = ref(false)
const error = ref('')
const receipt = ref('')

async function addCoauthor() {
  if (coauthors.value.length >= 3 || submitting.value) return
  const key = ++nextKey
  coauthors.value.push({ ...emptyAuthor(), key })
  await nextTick()
  document.getElementById(`coauthor-first-${key}`)?.focus()
}

function selectFile(event: Event) {
  const input = event.target as HTMLInputElement
  const candidate = input.files?.[0] ?? null
  error.value = candidate ? validatePaperFile(candidate) : ''
  pdf.value = error.value ? null : candidate
  if (error.value) input.value = ''
}

const cleanAuthor = (author: PaperAuthor): PaperAuthor => ({
  firstName: author.firstName.trim(), lastName: author.lastName.trim(), university: author.university.trim(),
})

async function submit() {
  if (submitting.value) return
  error.value = ''
  const authors = [mainAuthor, ...coauthors.value].map(cleanAuthor)
  if (!title.value.trim() || authors.some(author => !author.firstName || !author.lastName || !author.university)) {
    error.value = 'Completa el título, nombres, apellidos y universidad de cada autor.'
    return
  }
  if (!pdf.value) { error.value = 'Selecciona el archivo PDF de tu paper.'; return }
  error.value = validatePaperFile(pdf.value)
  if (error.value) return

  const body = new FormData()
  body.append('data', JSON.stringify({ title: title.value.trim(), mainAuthor: authors[0], coauthors: authors.slice(1) }))
  body.append('file', new Blob([pdf.value], { type: 'application/pdf' }), pdf.value.name)
  submitting.value = true
  try {
    const result = await request<{ success: boolean; data: { id: string } }>('/api/v1/papers', { method: 'POST', body, timeout: 60000 })
    if (!result.success || !result.data?.id) throw new Error('Respuesta inválida')
    receipt.value = result.data.id
    Object.assign(mainAuthor, emptyAuthor())
    coauthors.value = []
    title.value = ''
    pdf.value = null
  } catch (cause: unknown) {
    const failure = cause as { statusCode?: number; data?: { message?: string } }
    error.value = failure.data?.message || (failure.statusCode === 413 ? 'El PDF supera el máximo de 5 MB.' : 'No pudimos confirmar la recepción. Tus datos se mantienen; revisa tu conexión antes de volver a intentar.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
label { display: block; margin-bottom: .5rem; color: #e2e8f0; font-weight: 500; }
input, textarea { display: block; width: 100%; min-width: 0; border: 1px solid #ffffff30; border-radius: .65rem; background: #041d39; padding: .75rem; color: white; }
input:focus-visible, textarea:focus-visible, button:focus-visible { outline: 2px solid #22d3ee; outline-offset: 3px; }
input[type="file"] { font-size: .875rem; }
input::file-selector-button { margin-right: .75rem; border: 0; border-radius: .4rem; background: #00d9e8; padding: .5rem; color: #032f5f; font-weight: 600; cursor: pointer; }
</style>
