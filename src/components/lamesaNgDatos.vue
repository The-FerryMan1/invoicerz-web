<script setup lang="ts" generic="T extends Record<string, any>, key = T[keyof T]">
import type { TableColumn } from '@nuxt/ui';
import { computed } from 'vue';
const props = defineProps<{
    data: T,
    key: keyof T,
    columns: TableColumn<T>[]
}>()

const tableData = computed(() => {
    const records = props.data.record
    return Array.isArray(records) ? records : []
})

</script>

<template>
    <UTable :data="tableData" class="flex-1" :columns />
</template>