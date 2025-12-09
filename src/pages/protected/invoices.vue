<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import { useInvoiceStore } from '@/stores/invoices';
import { h, onMounted, ref, resolveComponent } from 'vue'



const invoice = useInvoiceStore()

onMounted(async () => {
    await invoice.readInvoice(1)
})






</script>

<template>
    <AuthenticatedLayout>
        <UDashboardPanel>
            <template #header>
                <UDashboardNavbar title="Invoice">
                    <template #trailing>
                        <UDashboardSidebarCollapse />
                    </template>

                    <template #right>
                        <UColorModeButton />
                        <UserName />

                    </template>
                </UDashboardNavbar>
            </template>


            <template #body>




                <div v-if="invoice.invoicePaganition">
                    {{ invoice.invoicePaganition }}
                </div>

            </template>
        </UDashboardPanel>
    </AuthenticatedLayout>
</template>