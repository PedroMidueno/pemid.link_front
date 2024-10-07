<template>
  <main class="fixed-page flex flex-col items-center justify-center gap-12">
    <h1 class="text-5xl p-4">
      Gestiona tus links en pocos clics
    </h1>

    <section class="w-[1000px] flex flex-col gap-2">
      <h2 class="text-xl">
        Comienza a acortar tus links sin una cuenta
      </h2>
      <UForm
        :schema="schema"
        :state="state"
        :validate-on="['submit']"
        class="w-full flex items-baseline gap-4"
        @submit="onSubmit"
      >
        <UFormGroup
          v-slot="{ error }"
          name="url"
          size="xl"
          class="grow"
        >
          <UInput
            v-model.trim="state.url"
            placeholder="Pega tu url aquí"
            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
          />
        </UFormGroup>
        <UButton type="submit" size="xl" trailing-icon="i-mdi-magic-staff">
          Acortar
        </UButton>
      </UForm>
      <article class="flex gap-4 items-center h-8">
        <div v-if="shortUrl">
          Este es tu link: <span class="font-semibold underline themed-text">{{ shortUrl }}</span>
        </div>
        <div v-if="shortUrl">
          <UTooltip text="Copiar al portapapeles" :popper="{ placement: 'right' }">
            <UButton
              icon="i-mdi-content-copy"
              size="sm"
              square
              variant="link"
            />
          </UTooltip>
        </div>
      </article>
    </section>

    <section class="w-[1000px] flex flex-col items-center gap-4">
      <p class="text-2xl underline">
        Crea una cuenta y mejora la gestión de tus links:
      </p>
      <article class="w-full flex items-center justify-between">
        <div class="flex items-center gap-2 text-xl italic">
          <UIcon name="i-heroicons-check-badge-16-solid" class="text-[--bold-violet] dark:text-[--light-violet]" />
          <span>Crea links personalizados</span>
        </div>

        <div class="flex items-center gap-2 text-xl italic">
          <UIcon name="i-heroicons-check-badge-16-solid" class="text-[--bold-violet] dark:text-[--light-violet]" />
          <span>Guarda tus links creados</span>
        </div>

        <div class="flex items-center gap-2 text-xl italic">
          <UIcon name="i-heroicons-check-badge-16-solid" class="text-[--bold-violet] dark:text-[--light-violet]" />
          <span>Elimina un link cuando ya no lo necesites</span>
        </div>
      </article>
      <UButton
        size="xl"
        variant="solid"
        to="/login?action=signup"
      >
        Crear cuenta ahora
      </UButton>
    </section>
  </main>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const shortUrl = ref(null)
const state = reactive({
  url: undefined
})

/* eslint-disable */
const urlRegex
  = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
/* eslint-enable */

const schema = z.object({
  url: z.string({ message: '' })
    .min(1, { message: '' })
    .regex(urlRegex, { message: 'Url inválida' })
})

type Schema = z.output<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  // TODO
  console.log(event.data)
}
</script>
