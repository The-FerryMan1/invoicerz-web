<script setup lang="ts" generic="T extends Record<string, any>">
import type { TableColumn } from '@nuxt/ui';
import { useRoute } from 'vue-router';

const props = defineProps<{
    data: T[] | undefined,
    columns: TableColumn<T>[];
    totalRecord: number | undefined,
    limit: number | undefined
}>()

const page = defineModel<number>('page', {default: 1})

const route = useRoute()

function to(p:number){
    return {
        query: {
            ...route.query,
            page: p
        }
    }
}

</script>

<template>
    <div class="flex flex-col h-full gap-4">
        <UTable 
            sticky
            :data="data"
            :columns="columns"
             class="flex-1"

        />

        <div class="flex justify-between items-center px-4 py-2 border-t border-gray-200 dark:border-gray-800">
            <div>
                <UBadge v-if="totalRecord !== undefined" icon="i-lucide-list" color="neutral" variant="subtle">
                    Total: {{ totalRecord }}
                </UBadge>
            </div>
            
            <UPagination 
                v-if="totalRecord && limit"
                v-model:page="page" 
                :to 
                :items-per-page="limit" 
                :total="totalRecord" 
            />
        </div>
    </div>
    
</template>