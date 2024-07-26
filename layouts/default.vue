<template>
  <section>
    <UContainer
      as="nav"
      class="border-b themed-border w-full h-14 themed-shadow flex justify-between items-center"
    >
      <article class="h-14 flex justify-center items-center">
        <img src="" alt="Logo">
      </article>

      <article class="h-14 flex justify-center items-center gap-4">
        <ui-theme-switch />
        <ULink to="/login?action=signup">
          Registrarse
        </ULink>
        <ULink to="/login?action=signin">
          Iniciar sesión
        </ULink>
      </article>
    </UContainer>
    <UButton label="Prueba login" @click="pruebaLogin" />
    <slot />
  </section>
</template>

<script lang="ts" setup>
const pruebaLogin = () => {
  useAuthStore().login({
    email: 'mail@mail.com',
    password: 'admin123'
  })
}
</script>
