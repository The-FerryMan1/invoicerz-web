<script setup lang="ts">
import dashboardWrapper from '@/components/dashboardWrapper.vue';
import GenericModal from '@/components/genericModal.vue';
import { type FormFieldConfig } from '@/components/genericModal.vue';
import genericTable from '@/components/genericTable.vue';
import genericTool from '@/components/genericTool.vue';
import { useProductServices, type ProductServiceRecord } from '@/stores/products_services';
import type { TableColumn } from '@nuxt/ui';
import { storeToRefs } from 'pinia';
import { h, onMounted, reactive, ref, resolveComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import z from 'zod';
import type { Row } from '@tanstack/vue-table'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const overlay = useOverlay()
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const modal = overlay.create(GenericModal)

const productService = useProductServices()
const { loading, productsServices} = storeToRefs(productService)

const page = ref<number>(1)
const search = ref<Partial<string>>(route.query.search as string || '')

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
                        items: getItemRow(row),
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

function getItemRow(row: Row<ProductServiceRecord>){
     return [
        {
            type: 'label',
            label: 'Actions'
        },
        {
            label: 'Copy Product/Service ID',
            icon: "i-lucide-clipboard",
            onSelect() {
               
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Edit Product/Service',
            icon: "i-lucide-pen",
            async onSelect() {
                modal.open({
                    title: 'Edit Product/Service', 
                    fields:clientField,
                    form:true,
                    initialData: row.original,
                    schema: clientschema as any,
                    serverError: null,
                })
            }
        },
        {
            label: 'Delete Produce/Service',
            icon: 'i-lucide-trash',
            async onSelect() {
                
            }
        }
    ]
}

async function onGetCsv() {
     await productService.getCSV()

}

async function Onsearch() {
    try {
    router.push({query: {...route.query, search: search.value,}})
    await productService.getProductServices({...route.query, search: search.value});
  } catch (error) {
    console.log(error)
  }
}

const clientschema = z.object({
    name: z.string('Name is required.').min(1),
    description:z.string('Name is required.').min(1),
    unitPrice: z.number().default(0),
    isService: z.boolean().default(false)

})

type Schema = z.infer<typeof clientschema>

const state = reactive<Partial<Schema>>({
    name: undefined,
    description: undefined,
    isService: undefined,
    unitPrice: undefined
})

const clientField:FormFieldConfig[] =[
    {   
        name: 'name',
        label: 'Name',
        placeholder: 'Enter the name of product',
        icon: '',
        required: true,
        type: 'text'
    }, 
    
     {   
        name: 'description',
        label: 'description',
        placeholder: 'Enter the description of product',
        icon: '',
        required: true,
        type: 'text'
    },
     {   
        name: 'isService',
        label: 'isService',
        placeholder: 'Enter the isService of product',
        icon: '',
        type: 'checkbox'
    },
     {   
        name: 'unitPrice',
        label: 'Unit price',
        placeholder: 'Enter the unit price of product',
        icon: '',
        required: true,
        type: 'number'
    }, 
]

function openModal(){
    modal.open({
        title: 'Add Product/Service', 
        fields:clientField,
        form:true,
        initialData: state,
        schema: clientschema as any,
        serverError: null,
        onSubmit: async (formdata)=>{
            console.log(formdata)
            const error = await productService.createProductService(formdata)

            if(!error){
                toast.add({title:"Product/Service has been created", color:'success'})
            }else{
                 toast.add({title:"Product/Service has been created", color:'warning'})
            }

            modal.close()

            
        }
    })
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