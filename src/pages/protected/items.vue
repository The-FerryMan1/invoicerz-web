<script setup lang="ts">
import dashboardWrapper from "@/components/dashboardWrapper.vue";
import GenericModal from "@/components/genericModal.vue";
import { type FormFieldConfig } from "@/components/genericModal.vue";
import genericTable from "@/components/genericTable.vue";
import genericTool from "@/components/genericTool.vue";
import type { TableColumn } from "@nuxt/ui";
import { storeToRefs } from "pinia";
import { h, onMounted, reactive, ref, resolveComponent, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import z from "zod";
import type { Row } from "@tanstack/vue-table";
import { useClipboard } from "@vueuse/core";
import { useItemsStore, type LineRecord } from "@/stores/items";


const route = useRoute();
const router = useRouter();
const toast = useToast();
const overlay = useOverlay();
const { copy } = useClipboard();
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const modal = overlay.create(GenericModal);
const lineitem = useItemsStore()
const { lineItems, loading } = storeToRefs(lineitem);

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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => `${row.getValue("description")}`,
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => `${row.getValue("unitPrice")}`,
  },
  {
    accessorKey: "isService",
    header: "Service / Product",
    cell: ({ row }) => `${row.getValue("isService") ? "Service" : "Product"}`,
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
            })
        )
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
  name: z.string("Name is required.").min(1),
  description: z.string("Name is required.").min(1),
  unitPrice: z.number().default(0),
  isService: z.boolean().default(false),
});

type Schema = z.infer<typeof clientschema>;

const state = reactive<Partial<Schema>>({
  name: undefined,
  description: undefined,
  isService: undefined,
  unitPrice: undefined,
});

const clientField: FormFieldConfig[] = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter the name of product",
    icon: "",
    required: true,
    type: "text",
  },

  {
    name: "description",
    label: "description",
    placeholder: "Enter the description of product",
    icon: "",
    required: true,
    type: "text",
  },
  {
    name: "isService",
    label: "Is this a service?",
    placeholder: "Enter the isService of product",
    icon: "",
    type: "checkbox",
  },
  {
    name: "unitPrice",
    label: "Unit price",
    placeholder: "Enter the unit price of product",
    icon: "",
    required: true,
    type: "number",
  },
];

function openModal() {
  modal.open({
    title: "Add Product/Service",
    fields: clientField,
    form: true,
    initialData: state,
    schema: clientschema as any,
    serverError: null,
    onSubmit: async (formdata) => {
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


watch(()=>route.params, async(newQuery)=>{
    await lineitem.readLineItems(newQuery)
},{deep: true, immediate: true })




</script>

<template>
      <dashboardWrapper title="Line Items">

     <genericTool :loading="loading" v-model:search="search" @search="Onsearch" @csv-get="onGetCsv">
      <UButton @click="openModal" icon="i-lucide-plus" class="shrink-0"
        >Create Line Item</UButton
      >
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