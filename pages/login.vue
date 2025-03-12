<template>
  <login />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'login'
})

useHead({
  title: 'Ingresar a tu cuenta de pemid.link',
  meta: [
    { property: 'og:title', content: 'Ingresar a tu cuenta de pemid.link' },
    { property: 'og:url', content: 'https://pemid.link/login' }
  ]
})
</script>
