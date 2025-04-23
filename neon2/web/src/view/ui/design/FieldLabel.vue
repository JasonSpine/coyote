<template>
  <span class="mb-1 block font-medium text-neutral-950 dark:text-neutral-050">
    {{props.title}}
    <span class="text-red-500" v-if="props.required">*</span>
  </span>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  required?: boolean;
}

const props = defineProps<Props>();
</script>
