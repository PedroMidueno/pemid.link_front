export const useUrlsStore = defineStore('urls', {
  state: () => ({
    customUrls: []
  }),
  actions: {
    async getLongUrl(code: string) {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.get(`/url/${code}`)
      return data
    }
  }
})
