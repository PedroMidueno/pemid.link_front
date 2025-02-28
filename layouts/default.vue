<template>
  <section class="w-full max-w-[1400px] mx-auto">
    <UContainer
      as="nav"
      class="h-12 flex justify-between items-center w-full pt-4 max-w-[1400px] sm:h-14 sticky top-0 themed-bg z-50"
    >
      <article class="h-10 sm:h-12 flex justify-center items-center">
        <img src="../assets/img/logo.svg" alt="Logo" class="h-full">
      </article>

      <article class="h-14 flex justify-center items-center gap-2">
        <ui-theme-switch />
        <UButton v-if="isAuthenticated" icon="i-mdi-logout" @click="signOut">
          <p class="hidden sm:block">
            Cerrar sesión
          </p>
        </UButton>

        <div v-else class="hidden sm:flex sm:gap-4 flex-nowrap">
          <UButton to="/login">
            Ingresar
          </UButton>
        </div>
        <UButton
          variant="ghost"
          icon="i-mdi-github"
          to="https://github.com/PedroMidueno/pemid.link_front"
          target="blank"
        />
        <UPopover v-if="!isAuthenticated" v-model:open="showMenu" class="sm:hidden">
          <UButton
            variant="ghost"
            :icon="showMenu ? 'i-mdi-close' : 'i-mdi-menu'"
          />

          <template #panel>
            <div class="p-4 flex gap-2">
              <UButton to="/login" @click="showMenu = false">
                Ingresar
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
const { isAuthenticated } = storeToRefs(authStore)
const { logout } = authStore
const showMenu = ref(false)

const signOut = () => {
  logout()
  router.push('/')
}
</script>
