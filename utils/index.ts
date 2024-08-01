import type { Notification } from '#ui/types'

export const showToast = (options: Partial<Notification>) => {
  useToast().add(options)
}

export const handleError = (errorMessage = 'Ocurrió un error inesperado') => {
  showToast({
    title: errorMessage,
    icon: 'i-mdi-error',
    color: 'red'
  })
}

export const handleSuccess = (successMessage = 'Operación realizada exitosamente') => {
  showToast({
    title: successMessage,
    icon: 'i-mdi-success'
  })
}
