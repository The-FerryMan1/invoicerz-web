import { useAxios } from "@/axios/axios";
import { csvLinkDownload } from "@/util/csvLink";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { LocationQuery } from "vue-router";

export type InvoiceRecord = {
  id: number;
  clientID: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
  subTotal: number;
  taxRate: number;
  totalAmount: number;
  notes: string;
  discount: number;
};

export type Invoices = {
  record: InvoiceRecord[];
  meta: {
    limit: number;
    currentPage: number;
    totalRecord: number;
    totalPages: number;
    recordsOnPage: number;
  };
};

export const useInvoiceStore = defineStore("invoice", () => {
  const invoices = ref<Invoices>();

  async function readInvoice(query: LocationQuery) {
    try {
      const { data, status } = await useAxios.get(`/invoices?page=${query.page ?? '1'}&search=${query.search ?? ''}&limit=10`);
      invoices.value = data;
    } catch (error) {
      console.log("Failed to retrieve invoices", error);
    }
  }

  async function createInvoice<T>(payload: T) {
    try {
      const { data, status } = await useAxios.post("/invoices", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!invoices.value?.record) return;

      const meta = invoices.value.meta;
      const currentRecord = invoices.value.record;
      const limit = meta.limit;

      if (meta.currentPage === 1) {
        invoices.value.record = [data, ...currentRecord];

        if (invoices.value.record.length > limit) {
          invoices.value.record.pop();
        }

        meta.totalRecord += 1;
        meta.totalPages = Math.ceil(meta.totalRecord / limit);
        meta.recordsOnPage = invoices.value.record.length;
      }
      return false;
    } catch (error) {
      const responseError = (error as AxiosError).response?.data;
      console.log(responseError);
      return responseError as string;
    }
  }

  async function updateInvoice<T>(id: number, payload: T) {
    try {
      const { data, status } = await useAxios.put(`/invoices/${id}`, payload);

      const updatedData = data as InvoiceRecord;

      if (!invoices.value?.record) return;

      const currentRecord = invoices.value.record as InvoiceRecord[];
      const updatedIndex = currentRecord.findIndex((invoice) => invoice.id === id);

      if (updatedIndex !== -1) {
        currentRecord[updatedIndex] = updatedData;
      }

      return false;
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  async function deleteInvoice(id: number) {
    try {
      const { data, status } = await useAxios.delete(`/invoices/${id}`);
      console.log(status);

      if (!invoices.value?.record) return;

      const meta = invoices.value?.meta;
      const currentRecord = invoices.value?.record as InvoiceRecord[];
      const limit = meta?.limit;

      const deletedIndex = currentRecord?.findIndex((invoice) => invoice.id === id);

      if (deletedIndex !== -1) {
        currentRecord.splice(deletedIndex, 1);

        meta.totalRecord -= 1;
        meta.totalPages = Math.ceil(meta.totalRecord / limit);
        meta.recordsOnPage = currentRecord.length;
      }

      return false;
    } catch (error) {
      console.log(error);
      return true
    }
  }

  async function generateInvoice(id: number) {
    try {
      const { data } = await useAxios.get(`/invoices/${id}/generate`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return false;
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  async function getCSV() {
    try {
      const { data } = await useAxios.get('/invoices/export', {
        responseType: 'blob'
      });
      csvLinkDownload(data, 'invoices');
      return false;
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  return {
    invoices,
    readInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    generateInvoice,
    getCSV
  };
});
