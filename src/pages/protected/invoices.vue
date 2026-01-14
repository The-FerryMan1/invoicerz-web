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
import { useInvoiceStore, type InvoiceRecord } from "@/stores/invoices";
import { useClientStore } from "@/stores/clients";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const overlay = useOverlay();
const { copy } = useClipboard();
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const modal = overlay.create(GenericModal);
const invoice = useInvoiceStore();
const { invoices } = storeToRefs(invoice);
const clients = useClientStore() 

const page = ref<number>(1);
const search = ref<Partial<string>>((route.query.search as string) || "");

const columns: TableColumn<InvoiceRecord>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey:"clientID",
    header: "Client ID",
    cell: ({ row }) => `${row.getValue("clientID")}`,
  },
  {
    accessorKey:"invoiceNumber",
    header: "Invoice Number",
    cell: ({ row }) => `${row.getValue("invoiceNumber")}`,
  },
  {
    accessorKey:"issueDate",
    header: "Issue Date",
    cell: ({ row }) => `${row.getValue("issueDate")}`,
  },
  {
    accessorKey:"dueDate",
    header: "Due Date",
    cell: ({ row }) => `${row.getValue("dueDate")}`,
  },
  {
    accessorKey:"status",
    header: "Status",
    cell: ({ row }) => `${row.getValue("status")}`,
  },
  {
    accessorKey:"subtotal",
    header: "Subtotal",
    cell: ({ row }) => `${row.getValue("subtotal")}`,
  },
  {
    accessorKey:"totalAmount",
    header: "Total Amount",
    cell: ({ row }) => `${row.getValue("totalAmount")}`,
  },
   {
    accessorKey:"notes",
    header: "Notes",
    cell: ({ row }) => `${row.getValue("notes")}`,
  },
   {
    accessorKey:"taxRate",
    header: "Tax Rate",
    cell: ({ row }) => `${row.getValue("taxRate")}`,
  },
  {
    accessorKey:"discount",
    header: "Discount",
    cell: ({ row }) => `${row.getValue("discount")}`,
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

function getItemRow(row: Row<InvoiceRecord>) {
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
        label: "Generate Invoice PDF",
        icon: "i-lucide-file-text",
        async onSelect() {
            const error = await invoice.generateInvoice(row.original.id);
            if (!error) {
              toast.add({ title: "Invoice PDF Generated", color: "success" });
            } else {
              toast.add({ title: "Invoice PDF failed to generate", color: "warning" });
            }
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
          selectItems: [clientsIDS.value || [], []],
          onSubmit: async (formdata) => {
            console.log(formdata)
            const error = await invoice.updateInvoice(row.original.id, formdata);
            if (!error) {
              toast.add({ title: "Item has been updated", color: "success" });
            } else {
              toast.add({ title: "Item failed to update", color: "warning" });
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
        const error = await invoice.deleteInvoice(row.original.id);
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
  const error = await invoice.getCSV();
  if (!error) {
    toast.add({ title: "Invoice Exported", color: "success" });
  } else {
    toast.add({ title: "Invoice failed to export", color: "warning" });
  }
}

async function Onsearch() {
  try {
    router.push({ query: { ...route.query, search: search.value } });
    await invoice.readInvoice({ ...route.query, search: search.value });
  } catch (error) {
    console.log(error);
  }
}


const clientschema = z.object({
  clientID: z.number().nonnegative(),
  dueDate: z.string(),
  notes: z.string("Name is required.").min(1),
  taxRate: z.number().nonnegative(),
  discount: z.number().nonnegative(),
});

type Schema = z.infer<typeof clientschema>;

const clientsIDS = computed(()=>clients.clients?.record.map((item)=> item.id))

onMounted(async()=>{
  if(!clients.clients?.record){
    console.log('fetch')
    await clients.readClients({})
  }
})

const state = reactive<Partial<Schema>>({
  clientID: undefined,
  dueDate: undefined,
  taxRate: undefined,
  notes: undefined,
  discount: undefined,
});

const clientField: FormFieldConfig[] = [
  {
    name: "clientID",
    label: "Client ID",
    placeholder: "Select Client ID",
    icon: "",
    required: true,
    type: "select",
  },
  {
    name: "dueDate",
    label: "Due Date",
    placeholder: "Select Due Date",
    icon: "",
    required: true,
    type: "date",
  },
  {
    name: "taxRate",
    label: "Tax Rate",
    placeholder: "Enter Tax Rate",
    icon: "",
    required: false,
    type: "number",
  },
  {
    name: "notes",
    label: "Notes",
    placeholder: "Enter Notes",
    icon: "",
    required: false,
    type: "textarea",
  },
  {
    name: "discount",
    label: "Discount",
    placeholder: "Enter Discount",
    icon: "",
    required: false,
    type: "number",
  }
];

function openModal() {
  if(!clientsIDS.value || clientsIDS.value.length  < 1){
    return toast.add({ title: "Please create a client first", color: "warning" });
  }


  modal.open({
    title: "Add Product/Service",
    fields: clientField,
    form: true,
    initialData: state,
    schema: clientschema as any,
    serverError: null,
    selectItems: [clientsIDS.value, []],
    onSubmit: async (formdata) => {
      console.log(formdata)
      const error = await invoice.createInvoice(formdata);
      if (!error) {
        toast.add({ title: "Invoice has been created", color: "success" });
      } else {
        toast.add({ title: "Invoice Failed to create", color: "warning" });
      }

      modal.close();
    },
  });
}

watch(
  () => route.params,
  async (newQuery) => {
    await invoice.readInvoice(newQuery);
  },
  { deep: true, immediate: true },
);



</script>

<template>
  <dashboardWrapper title="Invoice">
    <genericTool  v-model:search="search" @search="Onsearch" @csv-get="onGetCsv">
      <UButton @click="openModal" icon="i-lucide-plus" class="shrink-0">Create Line Item</UButton>
    </genericTool>
    <genericTable
      v-if="invoices?.record"
      v-model:page="page"
      :data="invoices?.record"
      :total-record="invoices?.meta.totalRecord"
      :limit="invoices?.meta.limit"
      :columns="columns"
    />
  </dashboardWrapper>
</template>
