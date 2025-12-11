<script setup lang="ts">
import { ref } from "vue";
const links = ref([
  {
    label: "Go back home",
    to: "/",
    icon: "i-lucide-home",
    color: "primary",
  },
]);
</script>

<template>
  <UPageSection title="Verification complete" :links> </UPageSection>
</template>
