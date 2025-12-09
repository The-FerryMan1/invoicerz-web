<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { authClient } from '@/lib/auth-client'
import { computed, onUnmounted, ref } from 'vue'


const initialTime = 60
const countDown = ref(0)
let timer: NodeJS.Timeout | null = null

const isDisabled = computed(() => countDown.value > 0)

const isVerified = ref<boolean | undefined>(false)
const emailUser = ref<string | undefined>(undefined)
const toast = useToast()
const fields: AuthFormField[] = [{
    name: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your full name',
    required: true
}, {
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
    name: 'confirm',
    label: 'Confirm password',
    type: 'password',
    required: true
}]

const schema = z.object({
    name: z.string('Name is required').min(8),
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters'),
    confirm: z.string('Confirm password is required').min(8, 'Must be at least 8 characters'),
}).refine((data) => data.confirm === data.password, {
    error: "Password don't match",
    path: ['confirm']
})

type Schema = z.output<typeof schema>



async function onSubmit(payload: FormSubmitEvent<Schema>) {
    const { data, error } = await authClient.signUp.email({
        name: payload.data.name,
        email: payload.data.email,
        password: payload.data.password,
        callbackURL: "http://localhost:5173/verify-email",
        fetchOptions: {
            onError(ctx) {
                toast.add({ title: "Registration Failed", description: ctx.error.message, color: "warning" })

            },
            onSuccess(ctx) {

                toast.add({ title: "Registration Success", description: "We sent verification via email.", color: "success" })
                isVerified.value = true
                counter()
            }
        }
    })

    emailUser.value = data?.user.email
}

async function resendVerificationSumbit() {

    if (!emailUser.value) return
    const { data, error } = await authClient.sendVerificationEmail({
        email: emailUser.value,
        fetchOptions: {
            onError(ctx) {
                toast.add({ title: "Send Verification Failed.", description: ctx.error.message, color: "warning" })

            },
            onSuccess(ctx) {

                toast.add({ title: "Resent email verification success", description: "We sent verification code on your email.", color: "success" })
                counter()
            }
        }
    })


}



function counter() {
    countDown.value = initialTime
    timer = setInterval(() => {
        countDown.value -= 1;

        if (countDown.value <= 0 && timer) {
            clearInterval(timer);
            timer = null
            countDown.value = 0
        }
    }, 1000)
}

onUnmounted(() => {
    if (!timer) return
    clearInterval(timer)
})


</script>

<template>
    <DefaultLayout>

        <UModal v-model:open="isVerified" :dismissible="false">
            <template #content>
                <UContainer>
                    <div class="p-5 flex flex-col justify-center items-center">
                        <h1 class="text-xl font-bold mb-5 text-center">Email verification sent.</h1>
                        <span class="my-3 text-green-500" v-if="countDown"> Verification Disabled: {{ countDown
                            }}s</span>
                        <UButton icon="i-lucide-mail" @click="resendVerificationSumbit" :disabled="isDisabled">resend
                        </UButton>
                    </div>

                </UContainer>
            </template>
        </UModal>
        <div class="flex flex-col items-center justify-center gap-4 p-4">
            <UPageCard class="w-full max-w-md">

                <UAuthForm :schema="schema" title="Account registration" icon="i-lucide-user" :fields="fields"
                    @submit="onSubmit">
                    <template #description>
                        Already have an account? <ULink to="/login" class="text-primary font-medium">Login</ULink>.
                    </template>
                </UAuthForm>
            </UPageCard>
        </div>
    </DefaultLayout>

</template>
