<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { type Record, useClientStore } from '@/stores/clients';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const client = useClientStore()
const { clients } = storeToRefs(client)
const route = useRoute()
const columns: TableColumn<Record>[] = [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
        accessorKey: 'companyName',
        header: 'Company Name',
        cell: ({ row }) => `${row.getValue('companyName')}`
    },
    {
        accessorKey: 'contactPerson',
        header: 'Contact person',
        cell: ({ row }) => `${row.getValue('contactPerson')}`
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => `${row.getValue('email')}`
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
        cell: ({ row }) => `${row.getValue('phone')}`
    },
    {
        accessorKey: 'addressStreet',
        header: 'Street address',
        cell: ({ row }) => `${row.getValue('addressStreet')}`
    },
    {
        accessorKey: 'addressCity',
        header: 'City',
        cell: ({ row }) => `${row.getValue('addressCity')}`
    },
    {
        accessorKey: 'addressZip',
        header: 'Zip',
        cell: ({ row }) => `${row.getValue('addressZip')}`
    },
    {
        accessorKey: 'addressCountry',
        header: 'Country',
        cell: ({ row }) => `${row.getValue('addressCountry')}`
    },
]

const page = ref(Number(route.query.page))

function to(page: number) {
    return {
        query: {
            page
        },
    }
}

watch(page, async () => {
    await client.readClients(page.value || Number(route.query.page))
})

</script>

<template>
    {{ page }}
    <UTable sticky :data="clients?.record" class="flex-1" :columns />
    <div class="flex justify-between items-center">
        <div class="">
            <UBadge icon="i-lucide-list" label="Total record">{{ clients?.meta.totalRecord }}</UBadge>
        </div>
        <UPagination v-model:page="page" :to :items-per-page="clients?.meta.limit" :total="clients?.meta.totalRecord" />
    </div>

</template>