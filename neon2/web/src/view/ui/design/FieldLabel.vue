<template>
  <span class="mb-1 block font-medium text-neutral-950" v-text="props.title"/>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

const props = defineProps<Props>();
</script>
