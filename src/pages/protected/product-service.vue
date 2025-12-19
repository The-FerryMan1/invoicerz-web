<script setup lang="ts">
import dashboardWrapper from '@/components/dashboardWrapper.vue';
import genericTable from '@/components/genericTable.vue';
import { useProductServices, type ProductServiceRecord } from '@/stores/products_services';
import type { TableColumn } from '@nuxt/ui';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute()
const productService = useProductServices()
const { loading, productsServices} = storeToRefs(productService)
const page = ref<number>(1)

const columns:TableColumn<ProductServiceRecord>[] = [
     {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => `#${row.getValue('id')}`
    },
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => `${row.getValue('name')}`
    },
     {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => `${row.getValue('description')}`
    },
     {
        accessorKey: 'unitPrice',
        header: 'Unit Price',
        cell: ({ row }) => `${row.getValue('unitPrice')}`
    },
    {
        accessorKey: 'isService',
        header: 'Service / Product',
        cell: ({ row }) => `${row.getValue('isService')? "Service":"Product"}`
    },
     {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => `${row.getValue('createdAt')}`
    },
     {
        accessorKey: 'updatedAt',
        header: 'Updated At',
        cell: ({ row }) => `${row.getValue('updatedAt')}`
    },
    
] 

watch(() => route.query, async (newQuery) => {
    await productService.getProductServices(newQuery);
    page.value = Number(newQuery.page) || 1;
}, { immediate: true, deep: true });


</script>

<template>
    <dashboardWrapper title="Product/Service">
        <genericTable v-if="productsServices?.record"  v-model:page="page" :data="productsServices?.record" :total-record="productsServices?.meta.totalRecord" :limit="productsServices?.meta.limit" :columns="columns"/>
    </dashboardWrapper>
</template>