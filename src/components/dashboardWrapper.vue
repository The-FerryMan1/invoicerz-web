<script setup lang="ts">
import userNameVue from '@/components/userName.vue';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';

defineProps<{
    title: string,
}>()

</script>

<template>
    <AuthenticatedLayout>
        <UDashboardPanel>
            <template #header>
                <UDashboardNavbar :title>
                    <template #trailing>
                        <UDashboardSidebarCollapse />
                    </template>

                    <template #right>
                        <UColorModeButton />
                        <userNameVue />

                    </template>
                </UDashboardNavbar>
            </template>


            <template #body>
                <slot></slot>
            </template>
        </UDashboardPanel>
    </AuthenticatedLayout>
</template>