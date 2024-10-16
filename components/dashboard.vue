<template>
  <section class="fixed-page flex justify-center">
    <UContainer as="article" class="w-2/3 pt-4 flex flex-col flex-nowrap gap-4">
      <h3 class="themed-text text-3xl font-medium text-center">
        Tus links
      </h3>
      <UForm
        :schema="schema"
        :state="state"
        class="border themed-border rounded-md p-4 flex flex-nowrap gap-4 items-end bg-[#3E065F15]"
        :validate-on="['submit']"
        @submit="onSubmit"
      >
        <UFormGroup label="Acorta un link nuevo" class="w-2/4">
          <UInput v-model.trim="state.longUrl" placeholder="Pega tu link aquí *" />
        </UFormGroup>
        <UFormGroup label="Código personalizado" hint="Opcional" class="w-1/4">
          <UInput v-model.trim="state.customCode" placeholder="mi-codigo" />
        </UFormGroup>
        <UButton
          type="submit"
          class="w-1/4 flex justify-center"
          trailing-icon="i-mdi-magic-staff"
          :loading="shorting"
        >
          Acortar
        </UButton>
      </UForm>

      <UInput
        v-model="q"
        placeholder="Filtrar links"
        class="w-1/4 self-end"
        @update:model-value="debouncedReq"
      />

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
          <span class="text-center w-full inline-block">
            {{ formatDate(new Date(row.createdAt)) }}
          </span>
        </template>

        <template #enabled-data="{ row }">
          <span class="text-center w-full inline-block">
            {{ row.enabled ? 'Activo' : 'Deshabilitado' }}
          </span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
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
          @update:model-value="getUrls"
        />
      </article>
    </UContainer>
    <UDivider orientation="vertical" icon="i-mdi-link" />
    <UContainer as="article" class="w-1/3 pt-4">
      <h3 class="themed-text text-3xl font-medium text-center">
        Tu perfil
      </h3>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { columns } from '~/helpers/urls.helper'
import type { UrlsTableRow } from '~/types'

const urlsStore = useUrlsStore()
const { shortenPrivate, shortenCustom, getUserUrls } = urlsStore
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
    rows.value = res.urls
    rowsNumber.value = res.count
  } catch (error: any) {
    showErrorToast(error.esMessage ?? 'Ocurrió un error al consultar las urls')
  } finally {
    loading.value = false
  }
}

const debouncedReq = debounce(getUrls, 400)

const actions = (row: UrlsTableRow) => [
  [
    {
      label: 'Visitar link',
      icon: 'i-heroicons-arrow-top-right-on-square',
      click: () => { console.log(row) }
    }
  ],
  [
    {
      label: 'Activar/deshabilitar',
      icon: 'i-heroicons-link-solid',
      click: () => { console.log(row.id) }
    },
    {
      label: 'Eliminar link',
      icon: 'i-heroicons-trash',
      click: () => { console.log(row.id) }
    }
  ]
]

onBeforeMount(async () => {
  await getUrls()
})
</script>
