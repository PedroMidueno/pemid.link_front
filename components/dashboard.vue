<template>
  <section class="fixed-page flex justify-center">
    <UContainer as="article" class="w-2/3 pt-4 flex flex-col flex-nowrap gap-4">
      <h3 class="themed-text text-3xl font-medium text-center">
        Tus links
      </h3>
      <UForm
        :schema="schema"
        :state="state"
        class="border themed-border rounded-md p-4 flex flex-nowrap gap-4 items-end bg-[#3E065F15]"
        :validate-on="['submit']"
        @submit="onSubmit"
      >
        <UFormGroup label="Acorta un link nuevo" class="w-2/4">
          <UInput v-model.trim="state.longUrl" placeholder="Pega tu link aquí *" />
        </UFormGroup>
        <UFormGroup label="Código personalizado" hint="Opcional" class="w-1/4">
          <UInput v-model.trim="state.code" placeholder="mi-codigo" />
        </UFormGroup>
        <UButton
          type="submit"
          class="w-1/4 flex justify-center"
          trailing-icon="i-mdi-magic-staff"
          :loading="shorting"
        >
          Acortar
        </UButton>
      </UForm>
    </UContainer>
    <UDivider orientation="vertical" icon="i-mdi-link" />
    <UContainer as="article" class="w-1/3 pt-4">
      <h3 class="themed-text text-3xl font-medium text-center">
        Tu perfil
      </h3>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const urlsStore = useUrlsStore()
const { shortenPrivate, shortenCustom } = urlsStore
const shorting = ref(false)
const state = reactive({
  longUrl: undefined,
  code: undefined
})

const urlRegex
  = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

const schema = z.object({
  longUrl: z.string({ message: '' })
    .min(1, { message: '' })
    .regex(urlRegex, { message: 'Url inválida' }),
  code: z.string({ message: '' }).optional()
})

type Schema = z.output<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  shorting.value = true

  const { longUrl, code } = event.data
  let customCode: string | undefined = undefined

  if (code) {
    customCode = code.replaceAll(' ', '-')
  }

  try {
    if (customCode) {
      await shortenCustom({ longUrl, customCode })
    } else {
      await shortenPrivate({ longUrl })
    }

    state.code = undefined
    state.longUrl = undefined
    showSuccessToast('Url acortada!')
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'Ocurrió un error inesperado')
  } finally {
    shorting.value = false
  }
}
</script>
