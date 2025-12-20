<script setup lang="ts">
const emit = defineEmits(['search', 'csvGet'])
const model = defineModel<string>('search', {default: ''})

async function onSearch() {
    emit('search')
}

async function onGetCsv() {
    emit('csvGet')
}
</script>

<template>
    <div class="flex justify-between gap-2 items-center">
      <UForm class="w-full" @submit="onSearch">
         <UInput v-model="model" type="text" icon="i-lucide-search" class="w-full" placeholder="Search......" />
      </UForm>
     
      <UForm @submit="onGetCsv">
         <UButton type="submit" class="shrink-0 text-nowrap" icon="i-lucide-file-spreadsheet">CSV Export</UButton>
      </UForm>

      <slot></slot>
    </div>
</template>