<script setup lang="ts">
import { computed } from 'vue';
import { type NavigationMenuItem } from '@nuxt/ui'
import { useRoute, useRouter } from 'vue-router';
import { authClient } from '@/lib/auth-client';
const route = useRoute()
const router = useRouter()
const items = computed<NavigationMenuItem[]>(() => [
    {
        label: "Dashboard",
        icon: "i-lucide-home",
        to: { name: "dashboard" },
        active: route.name === "dashboard"
    },
    {
        label: "Invoices",
        icon: "i-lucide-file",
        to: { name: "invoices" },
        active: route.name === "invoices"
    },
    {
        label: "Clients",
        icon: "i-lucide-user",
        to: { name: 'clients' },
        active: route.name === "clients"
    },
    {
        label: "Product/Services",
        icon: "i-lucide-handbag",
        to: "#",
        active: route.name === "1"
    },
    {
        label: "Items",
        icon: "i-lucide-list",
        to: "#",
        active: route.name === "1"
    },
    {
        label: "Settings",
        icons: "i-lucide-bolt",
        children: [
            {
                label: "Logout",
                icon: "i-lucide-log-out",
                onSelect: async () => {
                    await authClient.signOut()
                    router.push({ name: 'login' })
                }
            }
        ]
    }
])

</script>

<template>
    <UDashboardGroup>
        <UDashboardSidebar collapsible resizable>
            <template #header="{ collapsed }">
                <h1 v-if="!collapsed">Invoicers</h1>
            </template>
            <template #default="{ collapsed }">
                <UNavigationMenu :collapsed="collapsed" :items orientation="vertical" />
            </template>
        </UDashboardSidebar>


        <slot></slot>
    </UDashboardGroup>
</template>