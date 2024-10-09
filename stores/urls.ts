export const useUrlsStore = defineStore('urls', {
  state: () => ({
    customUrls: []
  }),
  actions: {
    async getLongUrl(code: string) {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.get(`/urls/${code}`)
      return data
    },

    async shortenPublic(longUrl: string) {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.post('/urls/shorten-public', { longUrl })
      return data
    },

    async shortenPrivate() {
      const { $axios } = useNuxtApp()
      // TODO
    },

    async shortenCustom() {
      const { $axios } = useNuxtApp()
      // TODO
    }
  }
})
