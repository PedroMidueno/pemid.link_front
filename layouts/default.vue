<template>
  <section>
    <UContainer
      as="nav"
      class="w-full h-14 flex justify-between items-center"
    >
      <article class="h-14 flex justify-center items-center">
        <img src="" alt="Logo">
      </article>

      <article v-if="isAuthenticated">
        <UDropdown :items="items">
          <UButton icon="i-mdi-triangle-small-down" trailing>
            {{ `Hola, ${user?.firstName} ${user?.lastName}` }}
          </UButton>
        </UDropdown>
      </article>

      <article v-else class="h-14 flex justify-center items-center gap-4">
        <ui-theme-switch />
        <UButton to="/login?action=signup" class="themed-button">
          Registrarse
        </UButton>
        <UButton to="/login?action=signin" class="themed-button">
          Iniciar sesión
        </UButton>
      </article>
    </UContainer>
    <slot />
  </section>
</template>

<script lang="ts" setup>
const router = useRouter()
const authStore = useAuthStore()
const { user, isAuthenticated } = storeToRefs(authStore)
const { logout } = authStore

const signOut = () => {
  logout()
  router.push('/')
}
const items = [
  [{
    label: 'Cerrar sesión',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: signOut
  }]
]
</script>
