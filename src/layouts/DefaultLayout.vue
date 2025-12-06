<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [

    {
        label: 'Home',
        to: { name: "home" },
        active: route.path === '/'
    },
    {
        label: 'Login',
        to: { name: "login" },
        active: route.path === '/login'
    },
    {
        label: 'Sign up',
        to: { name: "signup" },
        active: route.path === '/signup'
    },
])
</script>

<template>
    <UHeader>
        <template #title>
            <h1>Invoicerz</h1>
        </template>

        <UNavigationMenu :items="items" />

        <template #right>
            <UColorModeButton />
        </template>

        <template #body>
            <UNavigationMenu orientation="vertical" :items="items" />

        </template>

    </UHeader>


    <UMain>
        <UPageSection>
            <slot></slot>
        </UPageSection>
    </UMain>
</template>