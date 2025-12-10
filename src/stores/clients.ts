import { useAxios } from "@/axios/axios";
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
  const clients = ref<Clients | null>(null);

  async function readClients(page: number) {
    try {
      const { data, status } = await useAxios.get(`/clients?page=${page}&limit=10`);
      clients.value = data;
    } catch (error) {
      console.log(error);
    }
  }
  return { clients, readClients };
});
