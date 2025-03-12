import type { AuthState, UserWithToken } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    authToken: '',
    isAuthenticated: false
  }),
  persist: {
    storage: persistedState.localStorage
  },
  actions: {
    async logout() {
      this.user = null
      this.authToken = '',
      this.isAuthenticated = false
    },
    async getUserInfo() {
      const { $axios } = useNuxtApp()

      const user = await $axios.get('/admin/user')
      this.user = user?.data
    },
    socialLogin(userData: UserWithToken) {
      this.authToken = userData.token
      this.user = userData.user
      this.isAuthenticated = true
    },
    async verifyCAPTCHAToken(token: string) {
      const { $axios } = useNuxtApp()

      const { data } = await $axios.get(`/auth/grecaptcha/verify?response=${token}`)
      return data?.isValidCAPTCHAToken ?? false
    }
  }
})
