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
  let url: string = await getOriginalUrl()

  const hasHTTP = url.indexOf('http') === 0
  if (!hasHTTP) url = 'http://' + url

  await navigateTo(url, {
    external: true,
    replace: true,
    redirectCode: 301
  })
})

definePageMeta({
  layout: false
})
</script>
