<template>
  <section class="flex flex-col gap-2">
    <h3 class="themed-text text-2xl font-medium">
      Tu perfil
    </h3>
    <UForm
      :state="state"
      :schema="schema"
      class="flex flex-col gap-4 mb-8 mt-4"
      :validate-on="['submit']"
      @submit="onSubmit"
    >
      <article class="flex justify-between">
        <UFormGroup label="Nombre(s)" name="firstName">
          <UInput v-model="state.firstName" :disabled="!editing" />
        </UFormGroup>
        <UFormGroup label="Apellido(s)" name="lastName">
          <UInput v-model="state.lastName" :disabled="!editing" />
        </UFormGroup>
      </article>

      <UFormGroup label="Correo" name="email">
        <UInput v-model="state.email" :disabled="!editing" />
      </UFormGroup>

      <div class="text-gray-500 dark:text-gray-400 italic">
        Creación de la cuenta: 12/12/2024
      </div>

      <div class="flex justify-between items-center h-9">
        <UCheckbox v-model="editing" label="Editar información" />
        <UButton v-if="editing" label="Guardar" type="submit" />
      </div>
    </UForm>
    <change-password />
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const editing = ref(false)
const state = reactive<Record<string, string | undefined>>({
  firstName: undefined,
  lastName: undefined,
  email: undefined
})

const schema = z.object({
  firstName: z.string({ message: 'Campo obligatorio' }).min(1, 'Campo obligatorio'),
  lastName: z.string({ message: 'Campo obligatorio' }).min(1, 'Campo obligatorio'),
  email: z.string({ message: 'Campo obligatorio' }).email('Email inválido')
})

type Schema = z.output<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  console.log(event.data)
}
</script>
