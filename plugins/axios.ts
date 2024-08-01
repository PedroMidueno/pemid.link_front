import axios from 'axios'

export default defineNuxtPlugin(() => {
  const axiosInstance = axios.create({
    baseURL: useRuntimeConfig().public.backendUrl
  })

  const authStore = useAuthStore()


  axiosInstance.interceptors.request.use(config => {
    const token = authStore.authToken
    config.headers.Authorization = `Bearer ${token}`

    return config
  })

  axiosInstance.interceptors.response.use(response => {
    return response.data
  }, error => {
    return Promise.reject(error.response.data)
  })

  return {
    provide: {
      axios: axiosInstance
    }
  }
})
