import { defineStore } from 'pinia'
import type { UpdateUserInfo } from '~/types'

export const useAdminStore = defineStore('admin', {
  actions: {
    async updateUserInfo(params: UpdateUserInfo) {
      const { $axios } = useNuxtApp()
      await $axios.patch('/admin/user', params)
    }
  }
})
