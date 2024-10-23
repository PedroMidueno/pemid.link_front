import { defineStore } from 'pinia'
import type { UpdateUserInfo } from '~/types'

export const useAdminStore = defineStore('admin', {
  actions: {
    async updateUserInfo(params: UpdateUserInfo) {
      const { $axios } = useNuxtApp()
      await $axios.patch('/admin/update-user', params)
    },

    async validateCurrentPassword(params: any) {
      const { $axios } = useNuxtApp()
      const { data } = await $axios.post('/admin/validate-pass', params)
      return data.equals
    },

    async changePassword(params: any) {
      const { $axios } = useNuxtApp()
      await $axios.patch('/admin/change-password', params)
    }
  }
})
