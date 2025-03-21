<template>
  <main class="flex flex-col items-center justify-start py-4 sm:pt-0 sm:justify-center gap-4 sm:gap-8">
    <h1 class="text-4xl text-center md:text-5xl p-4">
      Gestiona tus links en pocos clics
    </h1>

    <section class="w-full px-4 max-w-[1300px] flex flex-col gap-4">
      <h2 class="text-lg sm:text-xl">
        Comienza a acortar tus links sin una cuenta
      </h2>
      <UForm
        :schema="schema"
        :state="state"
        :validate-on="['submit']"
        class="w-full flex flex-col gap-4"
        @submit="onSubmit"
      >
        <div class="w-full flex flex-col sm:flex-row items-end gap-4">
          <UFormGroup
            v-slot="{ error }"
            name="url"
            size="xl"
            class="w-full sm:grow"
            label="Pega tu link aquí"
          >
            <UInput
              v-model.trim="state.url"
              placeholder="https://www.mi-url-muy-muy-larga.com"
              :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
            />
          </UFormGroup>
          <UButton
            type="submit"
            class="w-full sm:w-[155px] flex justify-center"
            size="xl"
            :trailing-icon="btnLoading ? undefined : 'i-material-symbols-magic-button'"
            :loading="btnLoading"
          >
            {{ shortenBtnText }}
          </UButton>
        </div>

        <div id="recaptcha-widget" class="flex w-full justify-center sm:justify-start" />
      </UForm>
      <article
        class="flex gap-4 items-center h-20 p-4 sm:p-8 themed-border rounded-lg"
        :class="shortUrl ?'border-2 bg-[#3E065F15]': undefined"
      >
        <div
          v-if="shortUrl"
          class="text-lg sm:text-2xl"
        >
          Este es tu link:
          <span class="font-semibold underline themed-text text-xl sm:text-2xl">
            {{ shortUrl }}
          </span>
        </div>
        <div v-if="shortUrl">
          <UTooltip text="Copiar al portapapeles" :popper="{ placement: 'right' }">
            <UButton
              icon="i-mdi-content-copy"
              size="sm"
              square
              variant="link"
              @click="copyToClipboard(shortUrl)"
            />
          </UTooltip>
        </div>
      </article>
    </section>

    <section class="w-full max-w-[1300px] flex flex-col items-center gap-2 sm:gap-4">
      <p class="text-center text-xl sm:text-2xl underline px-4">
        Crea una cuenta y mejora la gestión de tus links:
      </p>
      <article class="w-full flex flex-col sm:flex-row items-center gap-2 sm:gap-0 justify-around px-4">
        <div class="flex items-center gap-2 text-xl italic grow">
          <UIcon name="i-heroicons-check-badge-16-solid" class="text-[--bold-violet] dark:text-[--light-violet]" />
          <span>Crea links personalizados</span>
        </div>

        <div class="flex items-center justify-center gap-2 text-xl italic grow">
          <UIcon name="i-heroicons-check-badge-16-solid" class="text-[--bold-violet] dark:text-[--light-violet]" />
          <span>Guarda tus links creados</span>
        </div>

        <div class="flex items-center justify-end gap-2 text-xl italic grow">
          <UIcon name="i-heroicons-check-badge-16-solid" class="text-[--bold-violet] dark:text-[--light-violet]" />
          <span>Desactiva y/o elimina links</span>
        </div>
      </article>
      <UButton
        size="xl"
        to="/login"
        class="w-60 flex justify-center"
      >
        Crear cuenta ahora
      </UButton>
    </section>
  </main>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent, Notification } from '#ui/types'

const { reCAPTCHAsiteKey } = useRuntimeConfig().public
const urlsStore = useUrlsStore()
const authStore = useAuthStore()
const { verifyCAPTCHAToken } = authStore
const { shortenPublic } = urlsStore
const shortUrl: Ref<string | null> = ref(null)
const state = reactive({
  url: undefined
})
const shortenBtnText = ref('Acortar')
const btnLoading = ref(false)
const isValidreCAPTCHA = ref(false)

const urlRegex
  = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

const schema = z.object({
  url: z.string({ message: '' })
    .min(1, { message: '' })
    .regex(urlRegex, { message: 'Url inválida' })
})

type Schema = z.output<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!isValidreCAPTCHA.value) return showErrorToast('Por favor marque la casilla')

  btnLoading.value = true
  try {
    const url = await shortenPublic(event.data.url)
    shortUrl.value = `${window.location.host}/${url.shortCode}`
    state.url = undefined;

    (window as any).grecaptcha?.reset()
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'Ocurrió un errror, intente de nuevo')
  } finally {
    btnLoading.value = false
  }
}

onMounted(() => {
  // Render reCAPTCHA on component mount
  const callback = async (response: string) => {
    btnLoading.value = true
    shortenBtnText.value = ''
    try {
      const isValidToken = await verifyCAPTCHAToken(response)
      isValidreCAPTCHA.value = isValidToken

      if (isValidToken === true) {
        showSuccessToast('Genial, no eres un robot! 😃')
      }
    } catch (error: any) {
      showErrorToast(error.esMessage ?? 'Error al verificar el CAPTCHA, intente de nuevo');
      (window as any).grecaptcha?.reset()
    } finally {
      btnLoading.value = false
      shortenBtnText.value = 'Acortar'
    }
  }

  const expiredCallback = () => {
    isValidreCAPTCHA.value = false
    showErrorToast('reCAPTCHA expirado, por favor marque la casilla de nuevo')
  }

  const errorCallback = () => {
    showErrorToast('Error al verificar el CAPTCHA, intente de nuevo');
    (window as any).grecaptcha?.reset()
  }

  const script = document.createElement('script')
  script.id = 'recaptcha-script'
  script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
  script.async = true
  script.defer = true

  script.onload = () => {
    (window as any).grecaptcha.ready(() => {
      (window as any).grecaptcha.render('recaptcha-widget', {
        'sitekey': reCAPTCHAsiteKey,
        callback,
        'expired-callback': expiredCallback,
        'error-callback': errorCallback
      })
    })
  }

  script.onerror = () => {
    const toastConfig: Partial<Notification> = {
      title: 'Ocurrió un error  😖',
      description: 'Por favor recargue la página',
      actions: [
        {
          label: 'Recargar',
          color: 'red',
          variant: 'outline',
          click: () => { location.reload() }
        }
      ],
      timeout: 0,
      icon: 'i-material-symbols-warning'
    }

    showToast(toastConfig)
  }

  document.head.appendChild(script)
})
</script>
