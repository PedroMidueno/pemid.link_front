<template>
  <section class="flex flex-col gap-1">
    <h3 class="themed-text text-2xl font-medium">
      Tu perfil
    </h3>
    <UForm
      ref="form"
      :state="state"
      :schema="schema"
      class="flex flex-col gap-4 mb-4"
      :validate-on="['submit']"
      @submit="onSubmit"
    >
      <UFormGroup label="Nombre(s)" name="firstName">
        <UInput v-model="state.firstName" :disabled="!editing" />
      </UFormGroup>
      <UFormGroup label="Apellido(s)" name="lastName">
        <UInput v-model="state.lastName" :disabled="!editing" />
      </UFormGroup>

      <UFormGroup label="Correo" name="email">
        <UInput v-model="state.email" :disabled="!editing" />
      </UFormGroup>

      <div class="text-gray-500 dark:text-gray-400 italic text-sm">
        Creación de la cuenta: {{ formatDate(user?.createdAt, 'long') }}
      </div>

      <div class="flex justify-between items-center h-9">
        <UCheckbox v-model="editing" label="Editar información" @update:model-value="syncUserInfo" />
        <UButton
          v-if="editing"
          label="Guardar"
          type="submit"
          :loading="loading"
        />
      </div>
    </UForm>
    <change-password />
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent, Form } from '#ui/types'

interface ProfileState {
  firstName: string | undefined
  lastName: string | undefined
  email: string | undefined
}

const authStore = useAuthStore()
const adminStore = useAdminStore()
const { updateUserInfo } = adminStore
const { getUserInfo } = authStore
const { user } = storeToRefs(authStore)
const editing = ref(false)
const state = reactive<ProfileState>({
  firstName: undefined,
  lastName: undefined,
  email: undefined
})
const form = ref<Form<Schema>>()
const loading = ref(false)

const schema = z.object({
  firstName: z.string({ message: 'Campo obligatorio' }).min(1, 'Campo obligatorio'),
  lastName: z.string({ message: 'Campo obligatorio' }).min(1, 'Campo obligatorio'),
  email: z.string({ message: 'Campo obligatorio' }).email('Email inválido')
})

type Schema = z.output<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true
  try {
    await updateUserInfo(event.data)
    await getUserInfo()
    syncUserInfo()
    showSuccessToast('Información actualizada')
    editing.value = false
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'No se pudo actualizar la información del usuario')
    syncUserInfo()
  } finally {
    loading.value = false
  }
}

const syncUserInfo = () => {
  state.firstName = user.value?.firstName
  state.lastName = user.value?.lastName
  state.email = user.value?.email
  form.value?.clear()
}

onBeforeMount(() => {
  syncUserInfo()
})
</script>
