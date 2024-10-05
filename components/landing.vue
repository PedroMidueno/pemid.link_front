<template>
  <main class="fixed-page flex flex-col items-center gap-8">
    <h1 class="text-6xl p-4 mt-8">
      Gestiona tus links en pocos clics
    </h1>
    <section>
      <h2>Comienza a acortar tus links sin iniciar sesión</h2>
      <UForm
        :schema="schema"
        :state="state"
        :validate-on="['sumbit']"
        @submit="onSubmit"
      >
        <UFormGroup v-slot="{ error }" name="url">
          <UInput
            v-model="state.url"
            placeholder="Pega tu url aquí"
            :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
          />
        </UFormGroup>

        <UButton type="submit">
          Submit
        </UButton>
      </UForm>
    </section>
  </main>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const state = reactive({
  url: undefined
})

const schema = z.object({
  url: z.string({ message: 'Campo obligatorio' })
    .min(1, { message: 'Campo Obligatorio' })
    .url({ message: 'Url inválida' })
})

type Schema = z.output<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  console.log(event.data)
}
</script>
