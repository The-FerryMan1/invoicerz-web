<script setup lang="ts">
import { authClient } from '@/lib/auth-client';

const session = authClient.useSession()
</script>
<template>
    <div class="flex  gap-3 items-center">
        <UAvatar v-if="session.data?.session" :text="session.data.user.name" size="md" icon="i-lucide-image" />
        <p class="text-light dark:text-gray-300 ">{{ session.data?.user.name }}</p>
    </div>

</template>