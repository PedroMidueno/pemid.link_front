<template>
  <div />
</template>

<script lang="ts" setup>
const urlStore = useUrlsStore()
const { getLongUrl } = urlStore

const route = useRoute()
const router = useRouter()

const getOriginalUrl = async () => {
  try {
    const code = route.params.code as string
    const { longUrl } = await getLongUrl(code)
    return longUrl
  } catch (error: any) {
    router.push('/')
    showErrorToast(error.esMessage || 'No se pudo obtener información de la url')
  }
}

onBeforeMount(async () => {
  const url = await getOriginalUrl()
  await navigateTo(url, {
    external: true
  })
})

definePageMeta({
  layout: false
})
</script>
