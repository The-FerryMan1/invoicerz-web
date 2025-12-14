<script setup lang="ts">
import { useClientStore } from '@/stores/clients';
import type { FormSubmitEvent } from '@nuxt/ui';
import { reactive, ref } from 'vue';
import z from 'zod';
const props = defineProps<{
    id: number,
    data: Schema
}>()
const emit = defineEmits<{ close: [boolean] }>()

const toast = useToast()
const clients = useClientStore()
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

type Schema = z.infer<typeof schema>
const emailExists = ref<string | null>(null)
const state = reactive<Partial<Schema>>({
    companyName: props.data.companyName,
    contactPerson: props.data.contactPerson,
    email: props.data.email,
    phone: props.data.phone,
    addressStreet: props.data.addressStreet,
    addressCity: props.data.addressCity,
    addressZip: props.data.addressZip,
    addressCountry: props.data.addressCountry,
})

async function onSubmit(payload: FormSubmitEvent<Schema>) {


    const error = await clients.updateClient<Schema>(props.id, payload.data)
    if (error) {
        emailExists.value = "Email already in use"
        return
    }
    toast.add({
        title: "Client Updated",
        color: 'success',
        icon: 'i-lucide-check'
    })
    emit('close', false)

}


</script>

<template>
    <UModal :close="{ onClick: () => emit('close', false) }" title="Edit client">
        <template #body="{ close }">
            <UForm @submit="onSubmit" :schema :state>

                <div class="grid grid-cols-2 grid-flow-row gap-5">
                    <UFormField label="Company name" name="companyName" :required="true">
                        <UInput icon="i-lucide-building" v-model="state.companyName"
                            placeholder="Name of the company" />
                    </UFormField>
                    <UFormField label="Contact person" name="contactPerson" :required="true">
                        <UInput icon="i-lucide-user" v-model="state.contactPerson" placeholder="Contact person" />
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
                        <UInput icon="i-lucide-building-2" v-model="state.addressCity" placeholder="Enter City " />
                    </UFormField>
                    <UFormField label="Zip" name="addressZip" :required="true">
                        <UInput icon="i-lucide-binary" v-model="state.addressZip" placeholder="Enter Zip" />
                    </UFormField>
                    <UFormField label="County" name="addressCountry" :required="true">
                        <UInput icon="i-lucide-globe" v-model="state.addressCountry" placeholder="Enter Country" />
                    </UFormField>
                </div>

                <div class="mt-5 flex gap-3 justify-end ">
                    <UButton type="submit">Submit</UButton>
                    <UButton label="Open" color="neutral" variant="subtle" @click="close">Close</UButton>
                </div>

            </UForm>
        </template>

    </UModal>
</template>