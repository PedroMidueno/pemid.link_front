<template>
  <section class="flex flex-col gap-2">
    <h3 class="themed-text text-xl font-medium">
      Tu perfil
    </h3>
    <UForm class="flex flex-col gap-4 mb-8">
      <article class="flex justify-between">
        <UFormGroup label="Nombre(s)">
          <UInput />
        </UFormGroup>
        <UFormGroup label="Apellido(s)">
          <UInput />
        </UFormGroup>
      </article>

      <UFormGroup label="Correo">
        <UInput />
      </UFormGroup>

      <div class="text-gray-500 dark:text-gray-400 italic">
        Creación de la cuenta: 12/12/2024
      </div>

      <div class="flex justify-between items-center">
        <UCheckbox label="Editar información" />
        <UButton label="Guardar" />
      </div>
    </UForm>
    <change-password />
  </section>
</template>

<script setup lang="ts">

</script>
