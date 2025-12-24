import { useAxios } from "@/axios/axios";
import { csvLinkDownload } from "@/util/csvLink";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface ProductServiceRecord {
  id: number;
  userID: string;
  name: string;
  description: string;
  unitPrice: number;
  isService: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProductService {
  record: ProductServiceRecord[];
  meta: {
    limit: number;
    currentPage: number;
    totalRecord: number;
    totalPages: number;
    recordsOnPage: number;
  };
}

export const useProductServices = defineStore("product_services", () => {
  const productsServices = ref<ProductService>();
  const loading = ref<boolean>(false);

  async function getProductServices(query: {}) {
    try {
      loading.value = true;
      console.log(query);
      const { data } = await useAxios.get("/productService", { params: query });
      productsServices.value = data;
    } catch (error) {
      console.log("error:", error);
    } finally {
      loading.value = false;
    }
  }

  async function createProductService(formdata: Record<string, any>): Promise<boolean> {
    try {
      loading.value = true;
      const { data } = await useAxios.post("/productService", formdata);

      if (!productsServices.value?.record) return true;

      const meta = productsServices.value.meta;
      const currentRecord = productsServices.value.record;
      const limit = meta.limit;

      if (meta.currentPage === 1) {
        productsServices.value.record = [data, ...currentRecord];

        if (productsServices.value.record.length > limit) {
          productsServices.value.record.pop();
        }

        meta.totalRecord += 1;

        meta.totalPages = Math.ceil(meta.totalRecord / limit);

        meta.recordsOnPage = productsServices.value.record.length;
      }

      return false;
    } catch (error) {
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function updateProdcutService(productSeviceID: number, formdata: Record<string, any>) {
    console.log(formdata, productSeviceID);
    try {
      loading.value = true;
      const { data } = await useAxios.put(`/productService/${productSeviceID}`, formdata);
      console.log(data);

      const updatedData = data as ProductServiceRecord;

      if (!productsServices.value?.record) return true;

      const currentRecord = productsServices.value.record;

      const updateItemIndex = currentRecord.findIndex((item) => item.id === productSeviceID);

      if (updateItemIndex !== -1) {
        currentRecord[updateItemIndex] = updatedData;
      }
      return false;
    } catch (error) {
      console.log("error:", error);
      return true;
    } finally {
      loading.value = false;
    }
  }

  async function deleteProductService(productSeviceID: number) {
    try {
      loading.value = true;
      await useAxios.delete(`/productService/${productSeviceID}`);

      if (!productsServices.value?.record && !productsServices.value?.record) return true;

      const meta = productsServices.value?.meta;
      const currentRecord = productsServices.value?.record;
      const limit = meta?.limit;

      const deletedIndex = currentRecord?.findIndex((item) => item.id === productSeviceID);

      if (deletedIndex !== -1) {
        currentRecord.splice(deletedIndex, 1);

        meta.totalRecord -= 1;
        meta.totalPages = Math.ceil(meta.totalRecord / limit);
        meta.recordsOnPage = currentRecord.length;
      }

      return false;
    } catch (error) {
      return true;
      console.log(error);
    } finally {
      loading.value = false;
    }
  }

  async function getCSV() {
    try {
      loading.value = true;
      const { data } = await useAxios.get("/productService/export", {
        responseType: "blob",
      });
      csvLinkDownload(data, "products/services");
      return false;
    } catch (error) {
      console.log(error);
      return true;
    } finally {
      loading.value = false;
    }
  }

  return {
    productsServices,
    loading,
    getProductServices,
    getCSV,
    createProductService,
    updateProdcutService,
    deleteProductService,
  };
});
