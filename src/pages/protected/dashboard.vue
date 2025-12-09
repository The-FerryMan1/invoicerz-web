<script setup lang="ts">
import type userNameVue from '@/components/userName.vue';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';

</script>

<template>
    <AuthenticatedLayout>
        <UDashboardPanel>
            <template #header>
                <UDashboardNavbar title="Dashboard">
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
                <div>Hello</div>
            </template>
        </UDashboardPanel>
    </AuthenticatedLayout>
</template>