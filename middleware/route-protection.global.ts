export default defineNuxtRouteMiddleware(to => {
  const { isAuthenticated } = useAuthStore().$state

  const unprotectedRoutes = ['/login', '/']

  if (!isAuthenticated && !unprotectedRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (isAuthenticated && unprotectedRoutes.includes(to.path)) {
    return navigateTo('/home')
  }
})
