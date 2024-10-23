<template>
  <UContainer as="section" class="h-screen flex justify-center items-center">
    <article class="border-2 themed-border rounded-lg p-4 space-y-8 w-1/3 min-w-[400px]">
      <h2 class="text-center">
        {{ isLogin ? 'Iniciar sesión' : 'Registrarse' }}
      </h2>
      <UForm
        ref="form"
        :schema="isLogin ? loginSchema : signUpSchema"
        :state="state"
        class="flex flex-col gap-2"
        @submit="onSubmit"
      >
        <UFormGroup
          v-if="!isLogin"
          size="xs"
          label="Nombre*"
          name="firstName"
        >
          <UInput v-model="state.firstName" />
        </UFormGroup>

        <UFormGroup
          v-if="!isLogin"
          size="xs"
          label="Apellidos*"
          name="lastName"
        >
          <UInput v-model="state.lastName" />
        </UFormGroup>

        <UFormGroup size="xs" label="Email*" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup size="xs" label="Contraseña*" name="password">
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
          size="xs"
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

        <UButton type="submit" block :loading="loading">
          {{ loading ? 'Enviando información, por favor espere' : 'Enviar' }}
        </UButton>

        <UDivider label="O" />

        <UButton class="flex justify-center" icon="i-devicon-google" @click="googleLogin()">
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
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import type { SignUpParams } from '~/types'

const { backendUrl } = useRuntimeConfig().public
const authStore = useAuthStore()
const { login, signup, loginWithGoogle } = authStore
const route = useRoute()
const router = useRouter()
const loading = ref(false)
const { action } = route.query
const isLogin = ref(!action || action === 'signin')
const showPassword = ref(false)
const form = ref()
const state = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loginSchema = z.object({
  email: z.string({ message: 'Campo obligatorio' }).email('Email inválido'),
  password: z.string({ message: 'Campo obligatorio' })
})

const signUpSchema = loginSchema.extend({
  firstName: z.string({ message: 'Campo obligatorio' }).min(1, 'Campo obligatorio'),
  lastName: z.string({ message: 'Campo obligatorio' }).min(1, 'Campo obligatorio'),
  password: z.string({ message: 'Campo obligatorio' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&_-]{8,}$/,
      'La contraseña debe tener al menos una minúscula, una mayúscula, un número, '
      + 'un caracter especial (@, $, !, %, *, #, ?, &, _, -) y una longitud mínima de 8 caracteres'
    ),
  confirmPassword: z.string({ message: 'Campo obligatorio' })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
})

const onSubmit = async (event: FormSubmitEvent<SignUpParams>) => {
  loading.value = true
  try {
    if (isLogin.value) {
      const { email, password } = event.data
      await login({ email, password })
      showSuccessToast('Inicio de sesión exitoso')
      router.push('/dashboard')
    } else {
      /* eslint-disable-next-line */
      const { confirmPassword, ...params } = event.data
      await signup(params)
      showSuccessToast('Usuario creado correctamente, ahora puede iniciar sesión')
      router.push({ query: { action: 'signin' } })
    }
  } catch (error: any) {
    showErrorToast(error?.esMessage ?? 'Ocurrió un error inesperado, intente más tarde')
  } finally {
    loading.value = false
  }
}

const googleLogin = () => {
  const popupOptions = 'location=none width=620 height=700 toolbar=no status=no menubar=no scrollbar=yes resizable=yes'
  window.open(`${backendUrl}/auth/google-login`, '_blank', popupOptions)!

  window.addEventListener('message', event => {
    if (!backendUrl.includes(event.origin)) return

    loginWithGoogle(event.data)
    router.push('/dashboard')
  }, false)
}

watch(() => route.query.action, newValue => {
  state.firstName = ''
  state.lastName = ''
  state.email = ''
  state.password = ''
  state.confirmPassword = ''
  form.value.clear()

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
