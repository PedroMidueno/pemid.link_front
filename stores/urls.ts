import type { PaginationParams } from '~/types'

export const useUrlsStore = defineStore('urls', {
  state: () => ({
    customUrls: []
  }),
  actions: {
    async getUserUrls(params: PaginationParams) {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.get('urls/user', { params })
      return data
    },

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

    async shortenPrivate(params: { longUrl: string }) {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.post('/urls/shorten', params)
      return data
    },

    async shortenCustom(params: { longUrl: string, customCode: string }) {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.post('/urls/shorten-custom', params)
      return data
    },

    async customCodeExists(code: string) {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.get(`/urls/custom-code-exists/${code}`)
      return data.exists
    }
  }
})
