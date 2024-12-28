<template>
  <section>
    <UContainer
      as="nav"
      class="h-12 flex justify-between items-center w-full sm:h-14"
    >
      <article class="h-10 sm:h-12 flex justify-center items-center">
        <img src="../assets/img/logo.svg" alt="Logo" class="h-full">
      </article>

      <article class="h-14 flex justify-center items-center gap-2">
        <ui-theme-switch />
        <UDropdown v-if="isAuthenticated" :items="items">
          <UButton icon="i-mdi-triangle-small-down" trailing>
            {{ `Hola, ${user?.firstName} ${user?.lastName}` }}
          </UButton>
        </UDropdown>

        <div v-else class="hidden sm:flex sm:gap-4 flex-nowrap">
          <UButton to="/login?action=signup">
            Registrarse
          </UButton>
          <UButton to="/login?action=signin">
            Iniciar sesión
          </UButton>
        </div>
        <UButton
          variant="ghost"
          icon="i-mdi-github"
          to="https://github.com/PedroMidueno/pemid.link_front"
          target="blank"
        />
        <UPopover v-model:open="showMenu" class="sm:hidden">
          <UButton
            variant="ghost"
            :icon="showMenu ? 'i-mdi-close' : 'i-mdi-menu'"
          />

          <template #panel>
            <div class="p-4 flex gap-2">
              <UButton to="/login?action=signup" @click="showMenu = false">
                Registrarse
              </UButton>
              <UButton to="/login?action=signin" @click="showMenu = false">
                Iniciar sesión
              </UButton>
            </div>
          </template>
        </UPopover>
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
const showMenu = ref(false)

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
