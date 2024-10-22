<template>
  <section class="flex flex-col gap-2 p-4 border border-gray-300 dark:border-gray-700 rounded-md -m-4 mb-4">
    <h3 class="themed-text text-xl font-medium">
      Cambiar contraseña
    </h3>
    <UForm class="flex flex-col gap-4">
      <UFormGroup label="Contraseña actual">
        <UInput />
      </UFormGroup>

      <UFormGroup label="Nueva contraseña">
        <UInput />
      </UFormGroup>

      <UFormGroup label="Confirmar nueva contraseña">
        <UInput />
      </UFormGroup>

      <div class="flex justify-between items-center">
        <UCheckbox label="Cambiar contraseña" />
        <UButton label="Guardar" />
      </div>
    </UForm>
  </section>
</template>

<script setup lang="ts">

</script>
