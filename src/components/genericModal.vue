<script setup lang="ts">
const emit = defineEmits<{close: [boolean]}>()

function onCLose(){
    emit('close', false)
}
</script>

<template>
    <UModal :close="{onClick: ()=> emit('close', false)}" title="generic modal">
        <template #body="{close}">
            <div>bulaga</div>
        </template>
    </UModal>
</template>