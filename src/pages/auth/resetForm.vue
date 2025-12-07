<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { authClient } from '@/lib/auth-client'
import { useRoute } from 'vue-router'

const route = useRoute()
const toast = useToast()
const fields: AuthFormField[] = [
    {
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Enter your password',
        required: true
    }, {
        name: 'confirm_password',
        label: 'Confirm password',
        type: 'password',
        placeholder: 'Confirm your password',
        required: true
    }]

const schema = z.object({
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    confirm_password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
}).refine((data) => data.confirm_password === data.password, {
    error: "Password don't match",
    path: ['confirm_password']
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    const token = route.params.token as string | undefined
    if (!token) {
        toast.add({ title: "Reset password failed", description: "No token found.", color: "warning" })
    }
    const { data, error } = await authClient.resetPassword({
        newPassword: payload.data.password,
        token,
        fetchOptions: {
            onError(ctx) {
                toast.add({ title: "Reset password failed.", color: "warning" })
            },
            onSuccess() {
                toast.add({ title: "Password Change successfully", color: "success" })
            }
        }

    })
}


</script>

<template>
    <DefaultLayout>
        <div class="flex flex-col items-center justify-center gap-4 p-4">
            <UPageCard class="w-full max-w-md">
                <UAuthForm :schema="schema" title="Password change" icon="i-lucide-lock" :fields="fields"
                    @submit="onSubmit">

                    <template #footer>
                        <ULink to="/">Home</ULink>
                    </template>
                </UAuthForm>
            </UPageCard>
        </div>
    </DefaultLayout>

</template>
