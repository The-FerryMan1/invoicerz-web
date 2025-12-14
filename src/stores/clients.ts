import { useAxios } from "@/axios/axios";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export type Record = {
  id: number;
  userID: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  addressStreet: string;
  addressCity: string;
  addressZip: string;
  addressCountry: string;
};

export type Clients = {
  record: Record[];
  meta: {
    limit: number;
    currentPage: number;
    totalRecord: number;
    totalPages: number;
    recordsOnPage: number;
  };
};
export const useClientStore = defineStore("client", () => {
  const clients = ref<Clients>();

  async function readClients(page: number) {
    try {
      const { data, status } = await useAxios.get(`/clients?page=${page}&limit=10`);
      clients.value = data;
    } catch (error) {
      console.log(error);
    }
  }

  async function createClient<T>(payload: T) {
    try {
      const { data, status } = await useAxios.post("/clients", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!clients.value?.record && !clients.value?.record) return;

      const meta = clients.value.meta;
      const curretRecord = clients.value.record;
      const limit = meta.limit;

      if (meta.currentPage === 1) {
        clients.value.record = [data, ...curretRecord];

        if (clients.value.record.length > limit) {
          clients.value.record.pop();
        }

        meta.totalRecord += 1;

        meta.totalPages = Math.ceil(meta.totalRecord / limit);

        meta.recordsOnPage = clients.value.record.length;
      }
      return false;
    } catch (error) {
      const responseError = (error as AxiosError).response?.data;
      console.log(responseError);
      return responseError as string;
    }
  }

  async function updateClient<T>(id: number, payload: T) {
    try {
      const { data, status } = await useAxios.put(`/clients/${id}`, payload);

      const updatedData = data as Record;

      if (!clients.value?.record) return;

      const currentRecord = clients.value.record as Record[];

      const updatedIndex = currentRecord.findIndex((client) => client.id === id);

      if (updatedIndex !== -1) {
        currentRecord[updatedIndex] = updatedData;
      }

      return false;
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  async function deleteClient(id: number) {
    try {
      const { data, status } = await useAxios.delete(`/clients/${id}`);
      console.log(status);

      if (!clients.value?.record && !clients.value?.record) return;

      const meta = clients.value?.meta;
      const currentRecord = clients.value?.record as Record[];
      const limit = meta?.limit;

      const deletedIndex = currentRecord?.findIndex((client) => client.id === id);

      if (deletedIndex !== -1) {
        currentRecord.splice(deletedIndex, 1);

        meta.totalRecord -= 1;
        meta.totalPages = Math.ceil(meta.totalRecord / limit);
        meta.recordsOnPage = currentRecord.length;
      }

      return;
    } catch (error) {
      console.log(error);
    }
  }
  return { clients, readClients, createClient, deleteClient, updateClient };
});
