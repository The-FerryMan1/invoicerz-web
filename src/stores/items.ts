import { useAxios } from "@/axios/axios";
import { csvLinkDownload } from "@/util/csvLink";
import { defineStore } from "pinia";
import { ref } from "vue";


export interface LineRecord{
id: number;
invoiceID: number;
productServiceID: number;
description: string
quantity: number,
unitPrice: number
 lineTotal: number
 createdAt: Date;
updatedAt: Date | null;
};


export interface Items {
  record: LineRecord[];
  meta: {
    limit: number;
    currentPage: number;
    totalRecord: number;
    totalPages: number;
    recordsOnPage: number;
  };
};
export const useItemsStore = defineStore('items', ()=>{
    const lineItems = ref<Items>()
    const loading = ref<boolean>(false)

    async function readLineItems(query:{}) {
        try {
            loading.value = true
            const {data} = await useAxios.get('/lineItems', {params: query})
            lineItems.value = data
        } catch (error) {
            console.log(error)
        }finally{
            loading.value = false
        }
    }

    async function createLineITem(formdata: Record<string, any>) {
        try {
      loading.value = true;
      const { data } = await useAxios.post("/lineItems", formdata);

      if (!lineItems.value?.record) return true;

      const meta = lineItems.value.meta;
      const currentRecord = lineItems.value.record;
      const limit = meta.limit;

      if (meta.currentPage === 1) {
        lineItems.value.record = [data, ...currentRecord];

        if (lineItems.value.record.length > limit) {
          lineItems.value.record.pop();
        }

        meta.totalRecord += 1;

        meta.totalPages = Math.ceil(meta.totalRecord / limit);

        meta.recordsOnPage = lineItems.value.record.length;
      }

      return false;
    } catch (error) {
      return true;
    } finally {
      loading.value = false;
    }
    }

    async function updateLineItem(lineItemID: number, formdata: Record<string, any>) {
        try {
              loading.value = true;
              const { data } = await useAxios.put(`/lineItems/${lineItemID}`, formdata);
              console.log(data);
        
              const updatedData = data as LineRecord;
        
              if (!lineItems.value?.record) return true;
        
              const currentRecord = lineItems.value.record;
        
              const updateItemIndex = currentRecord.findIndex((item) => item.id === lineItemID);
        
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

    async function deleteLineItem(lineItemID: number) {
        try {
      loading.value = true;
      await useAxios.delete(`/productService/${lineItemID}`);

      if (!lineItems.value?.record && !lineItems.value?.record) return true;

      const meta = lineItems.value?.meta;
      const currentRecord = lineItems.value?.record;
      const limit = meta?.limit;

      const deletedIndex = currentRecord?.findIndex((item) => item.id === lineItemID);

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
      const { data } = await useAxios.get("/lineItems/export", {
        responseType: "blob",
      });
      csvLinkDownload(data, "LineItems");
      return false;
    } catch (error) {
      console.log(error);
      return true;
    } finally {
      loading.value = false;
    }
    }
    
    return {
        readLineItems,
        lineItems,
        loading,
        createLineITem,
        updateLineItem,
        deleteLineItem,
        getCSV
    }
})