export default defineNuxtRouteMiddleware(to => {
  const { isAuthenticated } = useAuthStore().$state

  const protectedRoutes = ['/dashboard']

  if (!isAuthenticated && protectedRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  if (isAuthenticated && (to.path === '/login' || to.path === '/')) {
    return navigateTo('/dashboard')
  }
})
