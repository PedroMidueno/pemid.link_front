<template>
  <login />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'login'
})

useHead({
  title: 'Ingresar a tu cuenta de pemidlink',
  meta: [
    { property: 'og:title', content: 'Ingresar a tu cuenta de pemidlink' },
    { property: 'og:url', content: 'https://pemid.link/login' }
  ]
})
</script>
