import type { FormatStyle } from '@formkit/tempo'
import { format } from '@formkit/tempo'
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

/**
 * @param {Date} date a Date JS object
 * @param {string} dateType type of format (possible values: 'short', 'medium', 'long', 'full')
 * @returns formatted date
 */
export const formatDate = (date: Date = new Date(), dateType: FormatStyle = 'short') => {
  return format(date, { date: dateType }, 'es')
}

/**
 * @param {Date} date a Date JS object
 * @param {string} timeType type for time format (possible values: 'short', 'medium', 'long', 'full')
 * @returns formatted date time
 */
export const getDateTime = (date: Date = new Date(), timeType: FormatStyle = 'short') => {
  return format(date, { time: timeType }, 'es')
}
