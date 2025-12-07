<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { authClient } from '@/lib/auth-client'


const toast = useToast()
const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
}, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
}, {
    name: 'remember',
    label: 'Remember me',
    type: 'checkbox'
}]

const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    const { data, error } = await authClient.signIn.email({
        email: payload.data.email,
        password: payload.data.password,
        fetchOptions: {
            onError(ctx) {
                toast.add({ title: "Authentication Failed", description: ctx.error.message, color: "warning" })

            },
            onSuccess(ctx) {
                toast.add({ title: "Authentication Success", description: "Welcome back!", color: "success" })
            }
        }
    })
}


</script>

<template>
    <DefaultLayout>
        <div class="flex flex-col items-center justify-center gap-4 p-4">
            <UPageCard class="w-full max-w-md">
                <UAuthForm :schema="schema" title="Welcome back!" icon="i-lucide-user" :fields="fields"
                    @submit="onSubmit">
                    <template #description>
                        Don't have an account? <ULink to="/signup" class="text-primary font-medium">Sign up</ULink>.
                    </template>

                    <template #footer>
                        <ULink to="/reset-password">Reset password.</ULink>
                    </template>
                </UAuthForm>
            </UPageCard>
        </div>
    </DefaultLayout>

</template>
