import type { Notification } from '#ui/types'

export const showToast = (options: Partial<Notification>) => {
  useToast().add(options)
}

export const showErrorToast = (errorMessage = 'Ocurrió un error inesperado') => {
  showToast({
    title: errorMessage,
    icon: 'i-mdi-error',
    color: 'red'
  })
}

export const showSuccessToast = (successMessage = 'Operación realizada exitosamente') => {
  showToast({
    title: successMessage,
    icon: 'i-mdi-success'
  })
}

export const copyToClipboard = (str: string) => {
  navigator.clipboard.writeText(str)
    .then(() => {
      showSuccessToast('Copiado al portapapeles')
    })
    .catch(() => {
      showErrorToast('No se pudo copiar el texto')
    })
}

export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}
