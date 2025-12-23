<script setup lang="ts" generic="T extends Record<string, any>">
import type { FormSubmitEvent } from '@nuxt/ui';
import { reactive, ref, watch } from 'vue';
import type { z, ZodObject, ZodTypeAny} from 'zod/v3';


export interface FormFieldConfig{ 
    name: string
    label: string
    placeholder: string
    icon?: string
    required?:boolean
    type?:string
}


const props = defineProps<{
    form: boolean
    title: string
    initialData: T
    schema: any
    fields: FormFieldConfig[],
    serverError: string | null
}>()

const emit = defineEmits<{
    close: [boolean]
    submit: [data: T]
}>()


const state = reactive<T>({...props.initialData})
const localError = ref<string|null>(null)
watch(()=>props.serverError, (newVal) =>{
    localError.value = newVal
})

async function onSubmit(payload: FormSubmitEvent<T>) {
    localError.value = null
    emit('submit', payload.data)
}
</script>

<template>
    <UModal :close="{onClick: ()=> emit('close', false)}" :title="props.title">
        <template #body="{close}">
            <UForm v-if="props.form" @submit="onSubmit" :schema="props.schema" :state="state">
                <UFormField 
                    v-for="field in fields"
                    :key="field.name"
                    :label="field.label"
                    :name="field.name"
                    :required="field.required"
                >
                    <UInput
                        v-model="state[field.name]"
                        :icon="field.icon"
                        :placeholder="field.placeholder"
                        :type="field.type"
                        :class="{ 'border border-red-500 rounded-md': field.name === 'email' && localError }"
                       
                    />

                    <span v-if="field.name === 'email' && localError" class="text-red-500 text-xs mt-1">
                            {{ localError }}
                        </span>
                </UFormField>

                <div class="mt-5 flex gap-3 justify-end">
                    <UButton type="submit">Submit</UButton>
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="close" />
                </div>
            </UForm>
           
        </template>
    </UModal>
</template>