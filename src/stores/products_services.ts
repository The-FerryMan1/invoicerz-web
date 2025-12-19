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
            const {data} = await useAxios.get('/productService', {params: query})
            productsServices.value = data
        } catch (error) {
            console.log('error:', error)
        } finally{
            loading.value = false
        }
    }

    return {
        productsServices,
        loading,
        getProductServices
    }
})