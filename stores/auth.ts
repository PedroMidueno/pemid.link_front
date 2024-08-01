import type { LoginParams, SignUpParams } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    authToken: '',
    isAuthenticated: false
  }),
  persist: {
    storage: persistedState.localStorage
  },
  actions: {
    async signup(params: SignUpParams) {
      const { $axios } = useNuxtApp()

      await $axios.post('/admin/create-user', params)
    },
    async login(params: LoginParams) {
      const { $axios } = useNuxtApp()

      const res = await $axios.post('/auth/login', params)
      this.authToken = res.data.token
      this.isAuthenticated = true
      await this.getUserInfo()
    },
    async logout() {
      this.user = null
      this.authToken = '',
      this.isAuthenticated = false
    },
    async getUserInfo() {
      const { $axios } = useNuxtApp()

      const user = await $axios.get('/admin/get-user-info')
      this.user = user.data
    }
  }
})
