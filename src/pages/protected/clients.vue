<script setup lang="ts">
import ClientTable from "@/components/clientTable.vue";
import dashboardWrapper from "@/components/dashboardWrapper.vue";
import { useClientStore } from "@/stores/clients";
import type { FormSubmitEvent } from "@nuxt/ui";
import { watch } from "fs";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import z from "zod";

const clients = useClientStore();
const route = useRoute();
const router = useRouter()
const toast = useToast()
const open = ref<boolean>(false);
const search = ref<Partial<string>>(route.query.search as string || '')
const loading = ref<boolean>(false)


onMounted(async () => {
  await clients.readClients(route.query);
});

const schema = z.object({
    companyName: z.string("Company name is required."),
    contactPerson: z.string("Contact person is required."),
    email: z.email("Email is required."),
    phone: z.string("Phone is required."),
    addressStreet: z.string().optional(),
    addressCity: z.string().optional(),
    addressZip: z.string().optional(),
    addressCountry: z.string().optional(),
});

type Schmea = z.infer<typeof schema>;

const emailExists = ref<string | null>(null);
const state = reactive<Partial<Schmea>>({
    companyName: undefined,
    contactPerson: undefined,
    email: undefined,
    phone: undefined,
    addressStreet: undefined,
    addressCity: undefined,
    addressZip: undefined,
    addressCountry: undefined,
});

async function onSubmit(payload: FormSubmitEvent<Schmea>) {
  const error = await clients.createClient<Schmea>(payload.data);
    if (error) {
    emailExists.value = error as string;
    return;
    }

  open.value = !open.value;
}

async function onSearch(){

  try {
    loading.value = true
    router.push({query: {...route.query, search: search.value,}})
    await clients.readClients({...route.query, search: search.value});
  } catch (error) {
    console.log(error)
  }finally{
    loading.value = false
  }
}

async function csvGet(){
  const error = await clients.getCSV()
  if(!error){
    toast.add({title: "Table exported", color: 'success'})
  }else{
     toast.add({title: "CSV Exporting failed.", color: 'warning'})
  }
}

</script>

<template>
    <dashboardWrapper title="Clients">
    <div class="flex justify-between gap-2 items-center">

      <UForm class="w-full" @submit="onSearch">
         <UInput v-model="search" type="text" icon="i-lucide-search" class="w-full" placeholder="Search......" />
      </UForm>
     
      <UForm @submit="csvGet">
         <UButton type="submit" class="shrink-0 text-nowrap" icon="i-lucide-file-spreadsheet">CSV Export</UButton>
      </UForm>

            <UModal v-model:open="open" title="Add new client">
        <UButton icon="i-lucide-plus" class="shrink-0">Add Client</UButton>

                <template #body="{ close }">
                    <UForm @submit="onSubmit" :schema :state>
                        <div class="grid grid-cols-2 grid-flow-row gap-5">
                            <UFormField label="Company name" name="companyName" :required="true">
                <UInput
                  icon="i-lucide-building"
                  v-model="state.companyName"
                  placeholder="Name of the company"
                />
                            </UFormField>
                            <UFormField label="Contact person" name="contactPerson" :required="true">
                <UInput
                  icon="i-lucide-user"
                  v-model="state.contactPerson"
                  placeholder="Contact person"
                />
                            </UFormField>
                            <UFormField label="Email" name="email" :required="true">
                <UInput
                  icon="i-lucide-mail"
                  v-model="state.email"
                  placeholder="Enter Valid email"
                  :class="{ 'border border-red-500 rounded-md': emailExists }"
                />
                                <span v-if="emailExists" class="text-red-500 p-2">{{ emailExists }}</span>
                            </UFormField>
                            <UFormField label="Phone" name="phone" :required="true">
                <UInput
                  icon="i-lucide-phone"
                  v-model="state.phone"
                  placeholder="Enter phone number"
                />
                            </UFormField>
                            <UFormField label="Street" name="addressStreet" :required="true">
                <UInput
                  icon="i-lucide-signpost"
                  v-model="state.addressStreet"
                  placeholder="Enter Street Address"
                />
                            </UFormField>
                            <UFormField label="City" name="addressCity" :required="true">
                <UInput
                  icon="i-lucide-building-2"
                  v-model="state.addressCity"
                  placeholder="Enter City "
                />
                            </UFormField>
                            <UFormField label="Zip" name="addressZip" :required="true">
                                <UInput icon="i-lucide-binary" v-model="state.addressZip" placeholder="Enter Zip" />
                            </UFormField>
                            <UFormField label="County" name="addressCountry" :required="true">
                <UInput
                  icon="i-lucide-globe"
                  v-model="state.addressCountry"
                  placeholder="Enter Country"
                />
                            </UFormField>
                        </div>

            <div class="mt-5 flex gap-3 justify-end">
                            <UButton type="submit">Submit</UButton>
                            <UButton label="Open" color="neutral" variant="subtle" @click="close">Close</UButton>
                        </div>

                    </UForm>
                </template>

            </UModal>
        </div>


  




    <ClientTable v-if="!loading"/>
    <span v-else>Loading...... please wait!</span>
    </dashboardWrapper>
</template>
