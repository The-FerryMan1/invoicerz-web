import { useAxios } from "@/axios/axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface ProductServiceRecord {
    id: number,
    userID: string,
    name: string,
    description: string,
    unitPrice: number,
    isService: boolean,
    createdAt: string,
    updatedAt: string | null
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
};

export const useProductServices = defineStore('product_services', ()=>{

    const productsServices = ref<ProductService>()
    const loading = ref<boolean>(false)

    async function getProductServices(query: {}) {
        try {
            loading.value = true
            console.log(query)
            const {data} = await useAxios.get('/productService', {params: query})
            productsServices.value = data
        } catch (error) {
            console.log('error:', error)
        } finally{
            loading.value = false
        }
    }

    async function createProductService(formdata:Record<string, any>): Promise<boolean> {
        try {
            loading.value = true
            const {data} = await useAxios.post('/productService', formdata)

            if(!productsServices.value?.record) return true

            const meta = productsServices.value.meta
            const currentRecord = productsServices.value.record
            const limit = meta.limit

            if (meta.currentPage === 1) {
        productsServices.value.record = [data, ...currentRecord];

        if (productsServices.value.record.length > limit) {
          productsServices.value.record.pop();
        }

        meta.totalRecord += 1;

        meta.totalPages = Math.ceil(meta.totalRecord / limit);

        meta.recordsOnPage = productsServices.value.record.length;
      }

            return false
        } catch (error) {
            return true
        }finally{
            loading.value = false
        }
    }

    async function getCSV() {
        console.log("get csv")
    }

    return {
        productsServices,
        loading,
        getProductServices,
        getCSV,
        createProductService
    }
})