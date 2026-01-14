<script setup lang="ts">
import dashboardWrapper from "@/components/dashboardWrapper.vue";
import GenericModal from "@/components/genericModal.vue";
import { type FormFieldConfig } from "@/components/genericModal.vue";
import genericTable from "@/components/genericTable.vue";
import genericTool from "@/components/genericTool.vue";
import type { TableColumn } from "@nuxt/ui";
import { storeToRefs } from "pinia";
import { computed, h, onMounted, reactive, ref, resolveComponent, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import z from "zod";
import type { Row } from "@tanstack/vue-table";
import { useClipboard } from "@vueuse/core";
import { useItemsStore, type LineRecord } from "@/stores/items";
import { useInvoiceStore } from "@/stores/invoices";
import { useProductServices } from "@/stores/products_services";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const overlay = useOverlay();
const { copy } = useClipboard();
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const modal = overlay.create(GenericModal);
const lineitem = useItemsStore();
const { lineItems, loading } = storeToRefs(lineitem);
const invoice = useInvoiceStore()
const productService = useProductServices() 

const page = ref<number>(1);
const search = ref<Partial<string>>((route.query.search as string) || "");

const columns: TableColumn<LineRecord>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => `${row.getValue("name")}`,
  },
   {
    accessorKey: "invoiceID",
    header: "Invoice ID",
    cell: ({ row }) => `${row.getValue("invoiceID")}`,
  },
   {
    accessorKey: "productServiceID",
    header: "Product/Service ID",
    cell: ({ row }) => `${row.getValue("productServiceID")}`,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => `${row.getValue("description")}`,
  },
  {
     accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => `${row.getValue("quantity")}`,
  },
   {
     accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => `${row.getValue("unitPrice")}`,
  },
   {
     accessorKey: "lineTotal",
    header: "Line item total",
    cell: ({ row }) => `${row.getValue("lineTotal")}`,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => `${row.getValue("createdAt")}`,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => `${row.getValue("updatedAt")}`,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return h(
        "div",
        { class: "text-right" },
        h(
          UDropdownMenu,
          {
            content: {
              align: "end",
            },
            items: getItemRow(row),
            "aria-label": "Actions dropdown",
          },
          () =>
            h(UButton, {
              icon: "i-lucide-ellipsis-vertical",
              color: "neutral",
              variant: "ghost",
              class: "ml-auto",
              "aria-label": "Actions dropdown",
            }),
        ),
      );
    },
  },
];

function getItemRow(row: Row<LineRecord>) {
  return [
    {
      type: "label",
      label: "Actions",
    },
    {
      label: "Copy Item ID",
      icon: "i-lucide-clipboard",
      onSelect() {
        copy(`${row.original.id}`);
        toast.add({ title: "Copied Item ID", color: "success" });
      },
    },
    {
      type: "separator",
    },
    {
      label: "Edit Item",
      icon: "i-lucide-pen",
      async onSelect() {
        modal.open({
          title: "Edit Item",
          fields: clientField,
          form: true,
          initialData: row.original,
          schema: clientschema as any,
          serverError: null,
          selectItems: [invoiveItems.value || [], productServiceItems.value || []],
          onSubmit: async (formdata) => {
            const error = await lineitem.updateLineItem(row.original.id, formdata);
            if (!error) {
              toast.add({ title: "Item has been updated", color: "success" });
            } else {
              toast.add({ title: "Item dailed to update", color: "warning" });
            }

            modal.close();
          },
        });
      },
    },
    {
      label: "Delete Produce/Service",
      icon: "i-lucide-trash",
      async onSelect() {
        const error = await lineitem.deleteLineItem(row.original.id);
        if (!error) {
          toast.add({ title: "Item has been deleted", color: "success" });
        } else {
          toast.add({ title: "Item failed to delete", color: "warning" });
        }
      },
    },
  ];
}

async function onGetCsv() {
  const error = await lineitem.getCSV();
  if (!error) {
    toast.add({ title: "Item Exported", color: "success" });
  } else {
    toast.add({ title: "Item failed to export", color: "warning" });
  }
}

async function Onsearch() {
  try {
    router.push({ query: { ...route.query, search: search.value } });
    await lineitem.readLineItems({ ...route.query, search: search.value });
  } catch (error) {
    console.log(error);
  }
}

const clientschema = z.object({
  invoiceID: z.number().nonnegative(),
  productServiceID: z.number().nonnegative(),
  description: z.string("Name is required.").min(1),
  quantity: z.number().nonnegative(),
  unitPrice: z.number().default(0),
});

type Schema = z.infer<typeof clientschema>;

const invoiveItems = computed(()=>invoice.invoicePaganition?.record.map((item)=> item.id))
const productServiceItems = computed(()=>productService.productsServices?.record.map((item)=> item.id))

onMounted(async()=>{

  if(!productServiceItems.value){
    console.log('fetch')
    await productService.getProductServices({})
  }
})

const state = reactive<Partial<Schema>>({
  invoiceID: undefined,
  productServiceID: undefined,
  description: undefined,
  quantity: undefined,
  unitPrice: undefined,
});

const clientField: FormFieldConfig[] = [
  {
    name: "invoiceID",
    label: "Invoice ID",
    placeholder: "Select Invoice ID",
    icon: "",
    required: true,
    type: "select",
  },

  {
    name: "productServiceID",
    label: "Product/Service ID",
    placeholder: "Select Product/Service ID",
    icon: "",
    required: true,
    type: "select",
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Enter description",
    icon: "",
    type: "text",
  },
  {
    name: "unitPrice",
    label: "Unit price",
    placeholder: "Enter the unit price of product",
    icon: "",
    required: true,
    type: "number",
  },
  {
    name: "quantity",
    label: "Quantity",
    placeholder: "Enter the quantity of product",
    icon: "",
    required: true,
    type: "number",
  },
];

function openModal() {
  if(!invoiveItems.value || invoiveItems.value.length  < 1){
    return toast.add({ title: "Please create an invoice first", color: "warning" });
  }

  if(!productServiceItems.value || productServiceItems.value?.length  < 1 ){
    return toast.add({ title: "Please create a product/service first", color: "warning" });
  }


  modal.open({
    title: "Add Product/Service",
    fields: clientField,
    form: true,
    initialData: state,
    schema: clientschema as any,
    serverError: null,
    selectItems: [invoiveItems.value, productServiceItems.value],
    onSubmit: async (formdata) => {
      console.log(formdata)
      const error = await lineitem.createLineITem(formdata);
      if (!error) {
        toast.add({ title: "Item has been created", color: "success" });
      } else {
        toast.add({ title: "Item Failed to create", color: "warning" });
      }

      modal.close();
    },
  });
}

watch(
  () => route.params,
  async (newQuery) => {
    await lineitem.readLineItems(newQuery);
  },
  { deep: true, immediate: true },
);



</script>

<template>
  <dashboardWrapper title="Line Items">
    <genericTool :loading="loading" v-model:search="search" @search="Onsearch" @csv-get="onGetCsv">
      <UButton @click="openModal" icon="i-lucide-plus" class="shrink-0">Create Line Item</UButton>
    </genericTool>
    <genericTable
      v-if="lineItems?.record"
      v-model:page="page"
      :data="lineItems?.record"
      :total-record="lineItems?.meta.totalRecord"
      :limit="lineItems?.meta.limit"
      :columns="columns"
    />
  </dashboardWrapper>
</template>
