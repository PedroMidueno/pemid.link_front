import axios from 'axios'

export default defineNuxtPlugin(() => {
  const axiosInstance = axios.create({
    baseURL: useRuntimeConfig().public.backendUrl
  })

  const authStore = useAuthStore()
  const token = authStore.authToken

  axiosInstance.defaults.headers.common.authorization = `Bearer ${token}`

  axiosInstance.interceptors.response.use(response => {
    return response.data
  }, error => {
    return Promise.reject(error)
  })

  return {
    provide: {
      axios: axiosInstance
    }
  }
})
