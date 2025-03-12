/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const siteKey = config.public.reCAPTCHAsiteKey

  // Function to dynamically load the reCAPTCHA script
  function loadRecaptchaScript() {
    return new Promise((resolve, reject) => {
      if (document.getElementById('recaptcha-script')) {
        return resolve(window.grecaptcha)
      }

      const script = document.createElement('script')
      script.id = 'recaptcha-script'
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true

      script.onload = () => {
        if (window.grecaptcha) {
          resolve(window.grecaptcha)
        } else {
          reject(new Error('reCAPTCHA failed to load.'))
        }
      }

      script.onerror = () => reject(new Error('Failed to load reCAPTCHA script.'))

      document.head.appendChild(script)
    })
  }

  // Initialize the reCAPTCHA
  loadRecaptchaScript()
    .then(grecaptcha => {
      nuxtApp.provide('recaptcha', {
        render: (elementId, callback, expiredCallback) => {
          grecaptcha.ready(() => {
            grecaptcha.render(elementId, {
              'sitekey': siteKey,
              callback,
              'expired-callback': expiredCallback ?? undefined
            })
          })
        }
      })
    })
    .catch(() => {
      showErrorToast('Error al cargar el reCAPTCHA')
    })
})
