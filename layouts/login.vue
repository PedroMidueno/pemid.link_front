<template>
  <section>
    <UContainer
      as="nav"
      class="w-full h-14 flex justify-between items-center pt-4"
    >
      <article class="h-12 flex justify-center items-center">
        <img src="../assets/img/logo.svg" alt="pemid.link-logo" class="h-full">
      </article>

      <article class="h-14 flex justify-center items-center gap-4">
        <ui-theme-switch />

        <UButton to="/" class="themed-button hidden md:flex" icon="i-material-symbols-arrow-back">
          Regresar al inicio
        </UButton>

        <UButton to="/" class="themed-button flex md:hidden" icon="i-mdi-home" />

        <UButton
          variant="ghost"
          icon="i-mdi-github"
          to="https://github.com/PedroMidueno/pemid.link_front"
          target="blank"
        />
      </article>
    </UContainer>
    <slot />
  </section>
</template>
