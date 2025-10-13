<template>
  <div class="h-screen w-screen bg-[--custom-black] text-[--custom-black]">
    .
  </div>
</template>

<script lang="ts" setup>
const urlStore = useUrlsStore()
const { getLongUrl } = urlStore

const route = useRoute()
const router = useRouter()

const code = route.params.code as string

const { data, error } = await useAsyncData<string, { esMessage: string }>('redirectUrl', async () => {
  const { longUrl } = await getLongUrl(code)
  return longUrl
})

if (error.value) {
  router.push('/')
  if (import.meta.client) {
    showErrorToast(error.value.data?.esMessage || 'No se pudo obtener información de la url')
  }
} else if (data.value) {
  let url: string = data.value

  const hasHTTP = url.indexOf('http') === 0
  if (!hasHTTP) url = 'http://' + url

  await navigateTo(url, {
    external: true,
    replace: true,
    redirectCode: 301
  })
}

definePageMeta({
  layout: false
})
</script>

<style scoped>
body {
  background-color: var(--custom-black);
}
</style>
