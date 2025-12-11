<script setup lang="ts">
import type clientTableVue from '@/components/clientTable.vue';
import dashboardWrapper from '@/components/dashboardWrapper.vue';
import { useClientStore, type Record } from '@/stores/clients';
import type { FormSubmitEvent, TableColumn } from '@nuxt/ui';
import { computed, onMounted, reactive, ref, } from 'vue';
import { useRoute } from 'vue-router';
import z from 'zod';



const clients = useClientStore()
const route = useRoute()
const open = ref<boolean>(false)

onMounted(async () => {
    await clients.readClients(Number(route.query.page) || 1)
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

    open.value = !open.value

}


</script>

<template>
    <dashboardWrapper title="Clients">
        <div class="flex justify-end items-center">
            <UModal v-model:open="open" title="Add new client">
                <UButton icon="i-lucide-plus">Add Client</UButton>

                <template #body="{ close }">
                    <UForm @submit="onSubmit" :schema :state>

                        <div class="grid grid-cols-2 grid-flow-row gap-5">
                            <UFormField label="Company name" name="companyName" :required="true">
                                <UInput icon="i-lucide-building" v-model="state.companyName"
                                    placeholder="Name of the company" />
                            </UFormField>
                            <UFormField label="Contact person" name="contactPerson" :required="true">
                                <UInput icon="i-lucide-user" v-model="state.contactPerson"
                                    placeholder="Contact person" />
                            </UFormField>
                            <UFormField label="Email" name="email" :required="true">
                                <UInput icon="i-lucide-mail" v-model="state.email" placeholder="Enter Valid email"
                                    :class="{ 'border border-red-500 rounded-md': emailExists }" />
                                <span v-if="emailExists" class="text-red-500 p-2">{{ emailExists }}</span>
                            </UFormField>
                            <UFormField label="Phone" name="phone" :required="true">
                                <UInput icon="i-lucide-phone" v-model="state.phone" placeholder="Enter phone number" />
                            </UFormField>
                            <UFormField label="Street" name="addressStreet" :required="true">
                                <UInput icon="i-lucide-signpost" v-model="state.addressStreet"
                                    placeholder="Enter Street Address" />
                            </UFormField>
                            <UFormField label="City" name="addressCity" :required="true">
                                <UInput icon="i-lucide-building-2" v-model="state.addressCity"
                                    placeholder="Enter City " />
                            </UFormField>
                            <UFormField label="Zip" name="addressZip" :required="true">
                                <UInput icon="i-lucide-binary" v-model="state.addressZip" placeholder="Enter Zip" />
                            </UFormField>
                            <UFormField label="County" name="addressCountry" :required="true">
                                <UInput icon="i-lucide-globe" v-model="state.addressCountry"
                                    placeholder="Enter Country" />
                            </UFormField>
                        </div>

                        <div class="mt-5 flex gap-3 justify-end ">
                            <UButton type="submit">Submit</UButton>
                            <UButton label="Open" color="neutral" variant="subtle" @click="close">Close</UButton>
                        </div>

                    </UForm>
                </template>

            </UModal>
        </div>


        <ClientTable />




    </dashboardWrapper>
</template>
