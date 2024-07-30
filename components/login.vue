<template>
  <UContainer as="section" class="h-screen flex justify-center items-center">
    <article class="border-2 border-customViolet-50 rounded-lg p-4 space-y-8 w-1/3 min-w-[400px]">
      <h2 class="text-center">
        {{ isLogin ? 'Iniciar sesión' : 'Registrarse' }}
      </h2>
      <UForm
        :state="state"
        :validate="validate"
        class="flex flex-col gap-2"
      >
        <UFormGroup
          v-if="!isLogin"
          size="sm"
          label="Nombre*"
          name="name"
        >
          <UInput v-model="state.name" />
        </UFormGroup>

        <UFormGroup
          v-if="!isLogin"
          size="sm"
          label="Apellidos*"
          name="lastName"
        >
          <UInput v-model="state.lastName" />
        </UFormGroup>

        <UFormGroup size="sm" label="Email*" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup size="sm" label="Contraseña*" name="password">
          <UInput
            v-model="state.password"
            class="flex items-center relative"
            :type="showPassword ? 'text' : 'password'"
          >
            <UButton
              class="cursor-pointer absolute right-0"
              variant="link"
              :icon="showPassword ? 'i-mdi-eye-off' : 'i-mdi-eye'"
              @click="showPassword = !showPassword"
            />
          </UInput>
        </UFormGroup>

        <UFormGroup
          v-if="!isLogin"
          size="sm"
          label="Confirmar contraseña*"
          name="confirmPassword"
        >
          <UInput
            v-model="state.confirmPassword"
            class="flex items-center relative"
            :type="showPassword ? 'text' : 'password'"
          >
            <UButton
              class="cursor-pointer absolute right-0"
              variant="link"
              :icon="showPassword ? 'i-mdi-eye-off' : 'i-mdi-eye'"
              @click="showPassword = !showPassword"
            />
          </UInput>
        </UFormGroup>

        <UButton type="submit" block>
          Enviar
        </UButton>

        <UDivider label="O" />

        <UButton class="flex justify-center" icon="i-mdi-google">
          Ingresar con google
        </UButton>
      </UForm>
      <span
        class="text-center text-xs block"
      >
        {{ isLogin ? 'Si no tiene cuenta' : 'Si ya tiene cuenta' }}
        <a
          class="underline cursor-pointer"
          @click="router.push({ query: { action: isLogin ? 'signup' : 'signin' } })"
        >
          {{ isLogin ? 'regístrese' : 'inicie sesión' }}
        </a>
      </span>
    </article>
  </UContainer>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, FormError } from '#ui/types'
import type { LoginFormState } from '~/types'

const route = useRoute()
const router = useRouter()
const { action } = route.query
const isLogin = ref(!action || action === 'signin')
const showPassword = ref(false)

const state = reactive({
  name: undefined,
  lastName: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined
})

const validate = (state: LoginFormState): FormError[] => {
  console.log(state)
  const errors: FormError[] = []

  if (!state.email) errors.push({ path: 'email', message: 'campo obligatorio' })
  if (!state.password) errors.push({ path: 'password', message: 'campo obligatorio' })

  return errors
}

const onSubmit = async (event: FormSubmitEvent<LoginFormState>) => {

}

watch(() => route.query.action, newValue => {
  if (!newValue) {
    isLogin.value = true
  }

  if (newValue && newValue === 'signin') {
    isLogin.value = true
  }

  if (newValue && newValue === 'signup') {
    isLogin.value = false
  }
})
</script>
