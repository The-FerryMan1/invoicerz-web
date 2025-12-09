import { useAxios } from "@/axios/axios";
import { defineStore } from "pinia";
import { ref } from "vue";

type Record = {
  id: number;
  clientID: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
  subtTotal: number;
  taxRate: number;
  totalAmount: number;
  notes: string;
  discount: number;
};

type Invoice = {
  record: Record[];
  meta: {
    limit: number;
    currentPage: number;
    totalRecord: number;
    totalPages: number;
    recordsOnPage: number;
  };
};

export const useInvoiceStore = defineStore("invoice", () => {
  const invoicePaganition = ref<Invoice | null>(null);

  async function readInvoice(page: number) {
    try {
      const { data, status } = await useAxios.get(`/invoices?page=${page}&limit=10`);
      invoicePaganition.value = data;
    } catch (error) {
      console.log("Failed to retrieved invoices");
    }
  }

  return {
    invoicePaganition,
    readInvoice,
  };
});
