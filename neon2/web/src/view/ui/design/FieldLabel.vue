<template>
  <span :class="[
    'mb-1 block font-medium',
    props.disabled ? 'text-neutral-400' : 'text-neutral-950 dark:text-neutral-050',
    {'text-red-500':props.hasError}
  ]">
    {{props.title}}
    <span class="text-red-500" v-if="props.required">*</span>
  </span>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  required?: boolean;
  hasError?: boolean;
  disabled?: boolean;
}

const props = defineProps<Props>();
</script>
