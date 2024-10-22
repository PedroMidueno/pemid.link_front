import { defineStore } from 'pinia'
import type { UpdateUserInfo } from '~/types'

export const useAdminStore = defineStore('admin', {
  actions: {
    async updateUserInfo(params: UpdateUserInfo) {
      const { $axios } = useNuxtApp()
      await $axios.patch('/admin/update-user', params)
    },

    async validateCurrentPassword() {
      const { $axios } = useNuxtApp()
      // TODO
    },

    async changePassword() {
      const { $axios } = useNuxtApp()
      // TODO
    }
  }
})
