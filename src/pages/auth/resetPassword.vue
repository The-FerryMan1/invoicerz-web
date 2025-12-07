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
}]

const schema = z.object({
    email: z.email('Invalid email'),
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    const { data, error } = await authClient.requestPasswordReset({
        email: payload.data.email,
        fetchOptions: {
            onError(ctx) {
                console.log(ctx.error.message)
                toast.add({ title: "Send request reset password failed.", color: "warning" })
            },
            onSuccess() {
                toast.add({ title: "Request reset password sent", color: "success" })
            }
        }
    })
}


</script>

<template>
    <DefaultLayout>
        <div class="flex flex-col items-center justify-center gap-4 p-4">
            <UPageCard class="w-full max-w-md">
                <UAuthForm :schema="schema" title="Password reset" description="Enter your valid email."
                    icon="i-lucide-mail" :fields="fields" @submit="onSubmit">
                    <template #footer>
                        <ULink to="/login">Go back</ULink>
                    </template>
                </UAuthForm>
            </UPageCard>
        </div>
    </DefaultLayout>

</template>
