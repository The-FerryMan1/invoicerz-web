<script setup lang="ts" generic="T extends Record<string, any>">
import type { FormSubmitEvent } from "@nuxt/ui";
import { computed, reactive, ref, watch } from "vue";

export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  icon?: string;
  required?: boolean;
  type?: string;
}

const props = defineProps<{
  form: boolean;
  title: string;
  initialData: T;
  schema: any;
  fields: FormFieldConfig[];
  serverError: string | null;
  selectItems?: [Number[], Number[]];
}>();

const emit = defineEmits<{
  close: [boolean];
  submit: [data: T];
}>();

const state = reactive<T>({ ...props.initialData });
const localError = ref<string | null>(null);
watch(
  () => props.serverError,
  (newVal) => {
    localError.value = newVal;
  }
);

async function onSubmit(payload: FormSubmitEvent<T>) {
  localError.value = null;
  emit("submit", payload.data);
}

const findSelectType = computed(() => {
  return props.fields.filter((field) => field.type === "select");
});

const findNumberType = computed(() => {
  return props.fields.filter((field) => field.type === "number");
});

const findTextType = computed(() => {
  return props.fields.filter((field) => field.type === "text");
});

const findCheckboxType = computed(() => {
  return props.fields.filter((field) => field.type === "checkbox");
});

const findDateType = computed(() => {
  return props.fields.filter((field) => field.type === "date");
});

const findTextAreaType = computed(() => {
  return props.fields.filter((field) => field.type === "textarea");
});
</script>

<template>
  <UModal :close="{ onClick: () => emit('close', false) }" :title="props.title">
    <template #body="{ close }">
      <UForm
        v-if="props.form"
        @submit="onSubmit"
        :schema="props.schema"
        :state="state"
        class="w-full space-y-4"
      >
        <UFormField
          v-for="field in findSelectType"
          :key="field.name"
          :label="field.label"
          :name="field.name"
          :required="field.required"
        >
          <USelect
            v-if="field.type === 'select'"
            v-model="state[field.name]"
            :items="selectItems ? selectItems[findSelectType.indexOf(field)] : []"
            :icon="field.icon"
            :placeholder="field.placeholder"
            :options="selectItems"
            class="w-full"
          />
        </UFormField>

        <UFormField
          v-for="field in findDateType"
          :key="field.name"
          :label="field.label"
          :name="field.name"
          :required="field.required"
        >
          <UInput
            v-if="field.type === 'date'"
            v-model="state[field.name]"
            :icon="field.icon"
            :placeholder="field.placeholder"
            :type="field.type"
            class="w-full"
            :class="{ 'border border-red-500 rounded-md': field.name === 'email' && localError }"
          />
        </UFormField>

        <UFormField
          v-for="field in findTextAreaType"
          :key="field.name"
          :label="field.label"
          :name="field.name"
          :required="field.required"
        >
          <UTextarea
            v-if="field.type === 'textarea'"
            v-model="state[field.name]"
            :icon="field.icon"
            :placeholder="field.placeholder"
            class="w-full"
            :class="{ 'border border-red-500 rounded-md': field.name === 'email' && localError }"
          />
        </UFormField>


        <UFormField
          v-for="field in findCheckboxType"
          :key="field.name"
          :label="field.label"
          :name="field.name"
          :required="field.required"
        >
          <UCheckbox
            v-if="field.type === 'checkbox'"
            v-model="state[field.name]"
            :icon="field.icon"
            :placeholder="field.placeholder"
            class="w-full"
          />
        </UFormField>

        <UFormField
          v-for="field in findNumberType"
          :key="field.name"
          :label="field.label"
          :name="field.name"
          :required="field.required"
        >
          <UInput
            v-if="field.type === 'number'"
            v-model="state[field.name]"
            :icon="field.icon"
            :placeholder="field.placeholder"
            :type="field.type"
            class="w-full"
            :class="{ 'border border-red-500 rounded-md': field.name === 'email' && localError }"
          />
        </UFormField>

        <UFormField
          v-for="field in findTextType"
          :key="field.name"
          :label="field.label"
          :name="field.name"
          :required="field.required"
        >
          <UInput
            v-if="field.type === 'text'"
            v-model="state[field.name]"
            :icon="field.icon"
            :placeholder="field.placeholder"
            :type="field.type"
            class="w-full"
            :class="{ 'border border-red-500 rounded-md': field.name === 'email' && localError }"
          />
        </UFormField>
        <div class="mt-5 flex gap-3 justify-end">
          <UButton type="submit">Submit</UButton>
          <UButton label="Cancel" color="neutral" variant="subtle" @click="close" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
