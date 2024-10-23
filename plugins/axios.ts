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
    if (error.response.data.statusCode === 401 || error.response.status === 401) {
      if (authStore.isAuthenticated) {
        showErrorToast('Su sesión ha expirado, inicie sesión de nuevo para continuar')
        authStore.logout()
        return navigateTo('/login')
      }
    } else {
      return Promise.reject(error.response.data)
    }
  })

  return {
    provide: {
      axios: axiosInstance
    }
  }
})
