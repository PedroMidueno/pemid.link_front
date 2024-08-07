export default defineNuxtRouteMiddleware(to => {
  const { isAuthenticated } = useAuthStore().$state

  const protectedRoutes = ['/home']

  if (!isAuthenticated && protectedRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (isAuthenticated && !protectedRoutes.includes(to.path)) {
    return navigateTo('/home')
  }
})
