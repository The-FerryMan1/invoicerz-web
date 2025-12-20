<script setup lang="ts">
import dashboardWrapper from '@/components/dashboardWrapper.vue';
import GenericModal from '@/components/genericModal.vue';
import genericTable from '@/components/genericTable.vue';
import genericTool from '@/components/genericTool.vue';
import { useProductServices, type ProductServiceRecord } from '@/stores/products_services';
import type { TableColumn } from '@nuxt/ui';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const toast = useToast()
const overlay = useOverlay()

const modal = overlay.create(GenericModal)

const productService = useProductServices()
const { loading, productsServices} = storeToRefs(productService)

const page = ref<number>(1)
const search = ref<Partial<string>>(route.query.search as string || '')
const close = ref<boolean>(false)

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

async function onGetCsv() {
     await productService.getCSV()
//   if(!error){
//     toast.add({title: "Table exported", color: 'success'})
//   }else{
//      toast.add({title: "CSV Exporting failed.", color: 'warning'})
//   }
}

async function Onsearch() {
    try {
    router.push({query: {...route.query, search: search.value,}})
    await productService.getProductServices({...route.query, search: search.value});
  } catch (error) {
    console.log(error)
  }
}

function openModal(){
    modal.open()
}

watch(() => route.query, async (newQuery) => {
    await productService.getProductServices(newQuery);
    page.value = Number(newQuery.page) || 1;
}, { immediate: true, deep: true });


</script>

<template>
    <dashboardWrapper title="Product/Service">
        <genericTool
            v-model:search="search"
            @search="Onsearch"
            @csv-get="onGetCsv"
        >
        <UButton @click="openModal"  icon="i-lucide-plus" class="shrink-0">Create Product/Service</UButton>
    </genericTool>
        <genericTable v-if="productsServices?.record"  v-model:page="page" :data="productsServices?.record" :total-record="productsServices?.meta.totalRecord" :limit="productsServices?.meta.limit" :columns="columns"/>
    </dashboardWrapper>
</template>