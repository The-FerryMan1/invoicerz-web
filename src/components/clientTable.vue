<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { type Record, useClientStore } from '@/stores/clients';
import { storeToRefs } from 'pinia';
import { ref, watch, resolveComponent, h, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'
import ClientModal from './clientModal.vue';

const client = useClientStore()
const { clients } = storeToRefs(client)

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { copy } = useClipboard()
const overlay = useOverlay()
const modal = overlay.create(ClientModal)
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
    {
        id: 'actions',
        cell: ({ row }) => {
            return h(
                'div',
                { class: 'text-right' },
                h(
                    UDropdownMenu,
                    {
                        content: {
                            align: 'end'
                        },
                        items: getRowItems(row),
                        'aria-label': 'Actions dropdown'
                    },
                    () =>
                        h(UButton, {
                            icon: 'i-lucide-ellipsis-vertical',
                            color: 'neutral',
                            variant: 'ghost',
                            class: 'ml-auto',
                            'aria-label': 'Actions dropdown'
                        })
                )
            )
        }
    }
]

function getRowItems(row: Row<Record>) {
    return [
        {
            type: 'label',
            label: 'Actions'
        },
        {
            label: 'Copy client ID',
            icon: "i-lucide-clipboard",
            onSelect() {
                copy(`${row.original.id}`)

                toast.add({
                    title: "Client ID copied to clipboard.",
                    color: "success",
                    icon: "i-lucide-check"
                })
            }
        },
        {
            label: 'Invoice',
            icon: 'i-lucide-newspaper'
        },
        {
            type: 'separator'
        },
        {
            label: 'Edit client',
            icon: "i-lucide-pen",
            async onSelect() {
                modal.open({
                    id: row.original.id,
                    data: row.original,

                })
            }
        },
        {
            label: 'Delete client',
            icon: 'i-lucide-trash',
            async onSelect() {
                console.log('clicl')
                await client.deleteClient(row.original.id)
                    .finally(() => {
                        toast.add({
                            title: "Client Deleted successfully",
                            color: 'success',
                            icon: 'i-lucide-trash'
                        })
                    })
            }
        }
    ]
}

const page = ref(Number(route.query.page))

function to(page: number) {
    return {
        query: {
            page,
            ...route.query
        },
    }
}

watch(page, async () => {
    await client.readClients(route.query)
})


</script>

<template>
    <UTable sticky :data="clients?.record" class="flex-1" :columns />
    <div class="flex justify-between items-center">
        <div class="">
            <UBadge icon="i-lucide-list" label="Total record">{{ clients?.meta.totalRecord }}</UBadge>
        </div>
        <UPagination v-model:page="page" :to :items-per-page="clients?.meta.limit" :total="clients?.meta.totalRecord" />
    </div>

</template>