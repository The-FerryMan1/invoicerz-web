import { useAxios } from "@/axios/axios";
import type { AxiosError } from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

type Record = {
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

type Clients = {
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

      if (!clients.value?.record) return;

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
  return { clients, readClients, createClient };
});
