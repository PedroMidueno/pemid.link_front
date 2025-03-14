<template>
  <UContainer as="section" class="flex flex-col justify-center items-center w-full max-w-[1400px]">
    <article class="w-full pt-4 flex flex-col flex-nowrap gap-4">
      <h3 class="themed-text text-2xl font-medium">
        Crea nuevos links
      </h3>
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        class="border themed-border rounded-md p-4 flex flex-col flex-nowrap gap-4 items-start bg-[#3E065F15]"
        :validate-on="['input', 'submit']"
        @submit="onSubmit"
      >
        <UFormGroup class="w-full" name="longUrl" eager-validation>
          <UInput v-model.trim="state.longUrl" placeholder="Pega tu link aquí *" />
        </UFormGroup>
        <div class="w-full flex items-start gap-4">
          <UFormGroup
            help="Opcional"
            class="w-1/2"
            name="customCode"
          >
            <UInput v-model.trim="state.customCode" placeholder="codigo-personalizado" @update:model-value="debouncedCodeVerify" />
          </UFormGroup>
          <div class="flex flex-nowrap gap-1 w-1/2">
            <UButton
              class="w-3/4 flex justify-center"
              trailing-icon="i-material-symbols-magic-button"
              :loading="shorting"
              @click="validateForm"
            >
              Acortar
            </UButton>
            <UTooltip text="Limpiar campos" :popper="{ placement: 'top' }" class="w-1/4">
              <UButton
                class="w-full flex justify-center"
                trailing-icon="i-mdi-broom"
                variant="outline"
                @click="clearForm"
              />
            </UTooltip>
          </div>
        </div>
      </UForm>

      <article class="flex justify-between items-end">
        <h4 class="themed-text text-xl font-medium">
          Tus links creados
        </h4>
        <UInput
          v-model="q"
          placeholder="Filtrar links"
          class="w-[120px] sm:w-1/4 self-end"
          @update:model-value="debouncedGetUrls"
        />
      </article>

      <UTable
        :columns="columns"
        :rows="rows"
        class="border border-gray-300 dark:border-gray-700 rounded-md"
        :loading="loading"
      >
        <template #shortCode-data="{ row }">
          <div class="w-[200px] truncate">
            <a
              :href="`https://pemid.link/${row.shortCode}`"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline"
            >
              {{ `pemid.link/${row.shortCode}` }}
            </a>
          </div>
        </template>

        <template #longUrl-data="{ row }">
          <div class="w-[250px] truncate">
            <a
              :href="row.longUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:underline"
            >
              {{ row.longUrl }}
            </a>
          </div>
        </template>

        <template #createdAt-data="{ row }">
          <span class="w-full inline-block">
            {{ formatDate(new Date(row.createdAt)) }}
          </span>
        </template>

        <template #enabled-data="{ row }">
          <span class="w-full inline-block">
            {{ row.enabled ? 'Activo' : 'Deshabilitado' }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="tableActions(row)">
            <UButton variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>

        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <UIcon name="i-mdi-link-variant-remove" class="w-8 h-8" />
            <span class="italic text-sm">Nada por aquí</span>
          </div>
        </template>
      </UTable>
      <article class="w-full flex justify-end">
        <UPagination
          v-model="page"
          :page-count="rowsPerPage"
          :total="rowsNumber"
          class="mb-4"
          @update:model-value="getUrls"
        />
      </article>
    </article>
    <UDivider class="w-full" icon="i-mdi-link" />
    <article class="mt-4 flex flex-col h-fit w-full">
      <profile />
    </article>
  </UContainer>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent, Form, Notification } from '#ui/types'
import { columns } from '~/helpers/urls.helper'
import type { UrlsTableRow } from '~/types'

const urlsStore = useUrlsStore()
const { shortenPrivate, shortenCustom, getUserUrls, customCodeExists, changeEnabledStatus, deleteUrl } = urlsStore
const shorting = ref(false)
const rows = ref([])
const loading = ref(false)
const q = ref('')
const page = ref(1)
const rowsPerPage = ref(5)
const rowsNumber = ref(0)
const state = reactive({
  longUrl: undefined,
  customCode: undefined
})
const form = ref<Form<Schema>>()

const urlRegex
  = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/

const schema = z.object({
  longUrl: z.string({ message: '' })
    .min(1, { message: '' })
    .regex(urlRegex, { message: 'Url inválida' }),
  customCode: z.string({ message: '' }).optional()
})

type Schema = z.output<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  shorting.value = true

  const { longUrl, customCode } = event.data

  try {
    if (customCode) {
      await shortenCustom({ longUrl, customCode })
    } else {
      await shortenPrivate({ longUrl })
    }

    await getUrls()
    state.customCode = undefined
    state.longUrl = undefined
    showSuccessToast('Url acortada!')
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'Ocurrió un error inesperado')
  } finally {
    shorting.value = false
  }
}

const getUrls = async () => {
  loading.value = true
  try {
    const params = {
      page: page.value,
      rowsPerPage: rowsPerPage.value,
      q: q.value
    }
    const res = await getUserUrls(params)
    rows.value = res?.urls ?? []
    rowsNumber.value = res?.count ?? 0
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'No se pudieron obtener las urls')
  } finally {
    loading.value = false
  }
}

const verifyCodeAvailability = async (code: string) => {
  if (!code) return form.value!.clear('customCode')

  try {
    const codeAlreadyInUse = await customCodeExists(code)
    if (codeAlreadyInUse) {
      const currentErrors = form.value?.getErrors() ?? []
      form.value!.setErrors([...currentErrors, { message: 'Código no disponible', path: 'customCode' }])
      return codeAlreadyInUse
    } else {
      form.value!.clear('customCode')
      return codeAlreadyInUse
    }
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'Servicio no disponible')
  }
}

const validateForm = async () => {
  const code = state.customCode as unknown as string
  const isCodeInUse = await verifyCodeAvailability(code)
  if (isCodeInUse) return
  form.value!.submit()
}

const debouncedCodeVerify = debounce(verifyCodeAvailability, 400)

const debouncedGetUrls = debounce(async () => {
  await getUrls()
}, 400)

const clearForm = () => {
  state.customCode = undefined
  state.longUrl = undefined
  form.value!.clear()
}

const changeUrlStatus = async (urlId: number) => {
  loading.value = true

  try {
    await changeEnabledStatus(urlId)
    await getUrls()
    showSuccessToast('Estado de la url cambiada')
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'No se pudo cambiar el estado del link')
  } finally {
    loading.value = false
  }
}

const confirmDeleteUrl = (urlId: number) => {
  const toastConfig: Partial<Notification> = {
    title: '¿Eliminar link permanentemente?',
    description: 'Esta acción no se puede deshacer',
    actions: [
      {
        label: 'Eliminar',
        color: 'red',
        variant: 'outline',
        click: async () => { await onDeleteUrl(urlId) }
      },
      {
        label: 'Cancelar',
        color: 'primary'
      }
    ],
    timeout: 10000,
    icon: 'i-material-symbols-warning'
  }

  showToast(toastConfig)
}

const onDeleteUrl = async (urlId: number) => {
  loading.value = true

  try {
    await deleteUrl(urlId)
    await getUrls()
    showSuccessToast('Link eliminado')
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'No se pudo eliminar este link')
  } finally {
    loading.value = false
  }
}

const tableActions = (row: UrlsTableRow) => [
  [
    {
      label: 'Copiar link',
      icon: 'i-material-symbols-content-copy-outline',
      click: () => { copyToClipboard(`https://pemid.link/${row.shortCode}`) }
    },
    {
      label: 'Visitar destino',
      icon: 'i-material-symbols-arrow-outward-rounded',
      click: () => { window.open(row.longUrl, 'blank') }
    }
  ],
  [
    {
      label: `${row.enabled ? 'Deshabilitar link' : 'Habilitar link'}`,
      icon: `${row.enabled ? 'i-material-symbols-lock-outline' : 'i-material-symbols-lock-open-outline'}`,
      click: async () => { await changeUrlStatus(row.id) }
    },
    {
      label: 'Eliminar link',
      icon: 'i-material-symbols-delete-outline',
      click: () => { confirmDeleteUrl(row.id) }
    }
  ]
]

onBeforeMount(async () => {
  await getUrls()
})
</script>
