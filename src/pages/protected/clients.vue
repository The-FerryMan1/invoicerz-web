<script setup lang="ts">
import dashboardWrapper from '@/components/dashboardWrapper.vue';
import { useClientStore } from '@/stores/clients';
import type { FormSubmitEvent } from '@nuxt/ui';
import { onMounted, reactive, ref } from 'vue';
import z from 'zod';

const clients = useClientStore()


onMounted(async () => {
    await clients.readClients(2)
})

const schema = z.object({
    companyName: z.string("Company name is required."),
    contactPerson: z.string("Contact person is required."),
    email: z.email("Email is required."),
    phone: z.string("Phone is required."),
    addressStreet: z.string().optional(),
    addressCity: z.string().optional(),
    addressZip: z.string().optional(),
    addressCountry: z.string().optional(),
})

type Schmea = z.infer<typeof schema>


const emailExists = ref<string | null>(null)
const state = reactive<Partial<Schmea>>({
    companyName: undefined,
    contactPerson: undefined,
    email: undefined,
    phone: undefined,
    addressStreet: undefined,
    addressCity: undefined,
    addressZip: undefined,
    addressCountry: undefined,
})

async function onSubmit(payload: FormSubmitEvent<Schmea>) {
    const error = await clients.createClient<Schmea>(payload.data)
    if (error) {

        emailExists.value = error as string
        return
    }

}
</script>

<template>
    <dashboardWrapper title="Clients">
        <UModal title="Add new client">
            <UButton icon="i-lucide-plus">Add Client</UButton>

            <template #body>
                <UForm @submit="onSubmit" :schema :state>
                    {{ emailExists }}
                    <div class="grid grid-cols-2 grid-flow-row gap-5">
                        <UFormField label="Company name" name="companyName">
                            <UInput v-model="state.companyName" placeholder="Name of the company" />
                        </UFormField>
                        <UFormField label="Contact person" name="contactPerson">
                            <UInput v-model="state.contactPerson" placeholder="Contact person" />
                        </UFormField>
                        <UFormField label="Email" name="email">
                            <UInput v-model="state.email" placeholder="Enter Valid email" />
                        </UFormField>
                        <UFormField label="Phone" name="phone">
                            <UInput v-model="state.phone" placeholder="Enter phone number" />
                        </UFormField>
                        <UFormField label="Street" name="addressStreet">
                            <UInput v-model="state.addressStreet" placeholder="Enter Street Address" />
                        </UFormField>
                        <UFormField label="City" name="addressCity">
                            <UInput v-model="state.addressCity" placeholder="Enter City " />
                        </UFormField>
                        <UFormField label="Zip" name="addressZip">
                            <UInput v-model="state.addressZip" placeholder="Enter Zip" />
                        </UFormField>
                        <UFormField label="County" name="addressCountry">
                            <UInput v-model="state.addressCountry" placeholder="Enter Country" />
                        </UFormField>
                    </div>

                    <div class="mt-5 flex gap-3 justify-end ">
                        <UButton type="submit">Submit</UButton>
                        <UButton color="neutral">Close</UButton>
                    </div>

                </UForm>
            </template>

        </UModal>


        <div v-if="clients.clients">{{ clients.clients.record }}</div>
        <div v-if="clients.clients?.meta">{{ clients.clients?.meta }}</div>
    </dashboardWrapper>
</template>