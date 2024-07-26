<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      aria-label="Tema"
      variant="ghost"
      class="w-8 h-8"
      @click="isDark = !isDark"
    />
    <template #fallback>
      <article class="w-8 h-8 flex justify-center items-center">
        <UIcon
          name="i-mdi-loading"
          class="animate-spin"
        />
      </article>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>
