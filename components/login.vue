<template>
  <UContainer as="section" class="h-auto flex justify-center items-start w-full">
    <article class="rounded-lg p-4 space-y-4 w-1/3 min-w-[380px] mt-10">
      <h2 class="text-center text-lg">
        Ingrese con su proveedor favorito
      </h2>

      <UButton class="flex justify-center items-center gap-2 w-full" icon="i-mdi-google" @click="socialLogin('google')">
        Ingresar con google
      </UButton>
      <UButton class="flex justify-center items-center gap-2 w-full" icon="i-mdi-github" @click="socialLogin('github')">
        Ingresar con github
      </UButton>
    </article>
  </UContainer>
</template>

<script setup lang="ts">
const { public: { backendUrl } } = useRuntimeConfig()
const authStore = useAuthStore()
const { socialLogin: loginWithSocial } = authStore
const router = useRouter()

const socialLogin = (provider: 'google' | 'github') => {
  const popupOptions = 'location=none width=620 height=700 toolbar=no status=no menubar=no scrollbar=yes resizable=yes'
  window.open(`${backendUrl}/auth/${provider}`, '_blank', popupOptions)!

  window.addEventListener('message', event => {
    if (!backendUrl.includes(event.origin)) return

    loginWithSocial(event.data)
    router.push('/dashboard')
  }, false)
}
</script>
