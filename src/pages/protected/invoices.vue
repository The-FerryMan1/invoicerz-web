<script setup lang="ts">
import dashboardWrapper from '@/components/dashboardWrapper.vue';
import { useInvoiceStore } from '@/stores/invoices';
import { h, onMounted, ref, resolveComponent } from 'vue'



const invoice = useInvoiceStore()

onMounted(async () => {
    await invoice.readInvoice(1)
})






</script>

<template>


    <dashboardWrapper title="Invoices">

        <div v-if="invoice.invoicePaganition">
            {{ invoice.invoicePaganition }}
        </div>
    </dashboardWrapper>

</template>