<template>
  <section class="w-full max-w-[1400px] mx-auto">
    <UContainer
      as="nav"
      class="w-full h-14 flex justify-between items-center pt-4"
    >
      <NuxtLink to="/">
        <article class="h-12 flex justify-center items-center">
          <img src="../assets/img/logo.svg" alt="pemid.link-logo" class="h-full">
        </article>
      </NuxtLink>

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
          aria-label="Visitar Github de Pedro Midueño"
        />
      </article>
    </UContainer>
    <slot />
  </section>
</template>
