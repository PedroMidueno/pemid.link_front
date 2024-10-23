<template>
  <section class="flex flex-col gap-2 p-4 border border-gray-300 dark:border-gray-700 rounded-md -m-4 mb-4">
    <h3 class="themed-text text-xl font-medium">
      {{ user?.hasPass ? 'Cambiar' : 'Crear' }} contraseña
    </h3>
    <UForm
      ref="form"
      :state="state"
      :schema="user?.hasPass ? changePasswordSchema : createPasswordSchema"
      class="flex flex-col gap-4"
      :validate-on="['input', 'submit']"
      @submit="onSubmit"
    >
      <UFormGroup v-if="user?.hasPass" label="Contraseña actual" name="oldPassword">
        <UInput
          v-model="state.oldPassword"
          :disabled="!editing"
          :ui="{ icon: { base: 'animate-spin' } }"
          :trailing-icon="validatingPass ? 'i-mdi-loading' : undefined"
          @update:model-value="dValidateOldPassword"
        />
      </UFormGroup>

      <div v-else class="text-gray-500 dark:text-gray-400 italic text-sm">
        Puede crear una contraseña para iniciar sesión
      </div>

      <UFormGroup label="Nueva contraseña" name="newPassword" eager-validation>
        <UInput
          v-model="state.newPassword"
          :disabled="!editing"
          class="flex items-center relative"
          :type="showPassword ? 'text' : 'password'"
        >
          <UButton
            class="cursor-pointer absolute right-0"
            variant="link"
            :ui="{ variant: { link: 'disabled:text-white dark:disabled:text-white' } }"
            :icon="showPassword ? 'i-mdi-eye-off' : 'i-mdi-eye'"
            :disabled="!editing"
            @click="showPassword = !showPassword"
          />
        </UInput>
      </UFormGroup>

      <UFormGroup label="Confirmar nueva contraseña" name="confirmPassword" eager-validation>
        <UInput
          v-model="state.confirmPassword"
          :disabled="!editing"
          class="flex items-center relative"
          :type="showPassword ? 'text' : 'password'"
        >
          <UButton
            class="cursor-pointer absolute right-0"
            variant="link"
            :ui="{ variant: { link: 'disabled:text-white dark:disabled:text-white' } }"
            :icon="showPassword ? 'i-mdi-eye-off' : 'i-mdi-eye'"
            :disabled="!editing"
            @click="showPassword = !showPassword"
          />
        </UInput>
      </UFormGroup>

      <div class="h-8 flex justify-between items-center">
        <UCheckbox
          v-model="editing"
          :label="user?.hasPass ? 'Cambiar contraseña' : 'Crear contraseña'"
          @update:model-value="clearForm"
        />
        <UButton
          v-if="editing"
          label="Guardar"
          :loading="loading"
          @click="validateForm"
        />
      </div>
    </UForm>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent, Form } from '#ui/types'

interface FormState {
  oldPassword: string | undefined
  newPassword: string | undefined
  confirmPassword: string | undefined
}

const authStore = useAuthStore()
const adminStore = useAdminStore()
const { user } = storeToRefs(authStore)
const { validateCurrentPassword, changePassword } = adminStore
const { getUserInfo } = authStore
const state = reactive<FormState>({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
})
const form = ref<Form<Schema>>()
const editing = ref(false)
const loading = ref(false)
const validatingPass = ref(false)
const showPassword = ref(false)

const changePasswordSchema = z.object({
  oldPassword: z.string({ message: 'Escriba su contraseña actual' }),
  newPassword: z.string({ message: 'Campo obligatorio' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&_-]{8,}$/,
      'La contraseña debe tener al menos una minúscula, una mayúscula, un número, '
      + 'un caracter especial (@, $, !, %, *, #, ?, &, _, -) y una longitud mínima de 8 caracteres'
    ),
  confirmPassword: z.string({ message: 'Campo obligatorio' })
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

const createPasswordSchema = z.object({
  newPassword: z.string({ message: 'Campo obligatorio' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&_-]{8,}$/,
      'La contraseña debe tener al menos una minúscula, una mayúscula, un número, '
      + 'un caracter especial (@, $, !, %, *, #, ?, &, _, -) y una longitud mínima de 8 caracteres'
    ),
  confirmPassword: z.string({ message: 'Campo obligatorio' })
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

type Schema = z.output<typeof changePasswordSchema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true
  try {
    const { oldPassword, newPassword } = event.data
    await changePassword({ oldPassword, newPassword })
    editing.value = false
    clearForm()
    await getUserInfo()
    showSuccessToast('La contraseña se cambió exitosamente')
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'No se pudo actualizar la contraseña')
  } finally {
    loading.value = false
  }
}

const validateForm = async () => {
  const pass = state.oldPassword as string
  if (user.value?.hasPass) {
    const isOldPassValid = await validateOldPassword(pass)
    if (!isOldPassValid) return
  }

  form.value?.submit()
}

const validateOldPassword = async (pass: string) => {
  if (!pass) return form.value?.clear('oldPassword')
  validatingPass.value = true

  try {
    const validPassword = await validateCurrentPassword({ pass })
    if (!validPassword) {
      const currentErrors = form.value?.getErrors() ?? []
      form.value!.setErrors([...currentErrors, { message: 'La contraseña no coincide', path: 'oldPassword' }])
      return false
    } else {
      form.value!.clear('oldPassword')
      return true
    }
  } catch (error: any) {
    showErrorToast('Servicio no disponible')
  } finally {
    validatingPass.value = false
  }
}

const dValidateOldPassword = debounce(validateOldPassword, 500)

const clearForm = () => {
  state.newPassword = undefined
  state.oldPassword = undefined
  state.confirmPassword = undefined
  form.value?.clear()
  showPassword.value = false
}
</script>
