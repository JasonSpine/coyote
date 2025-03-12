<template>
  <button @click="click" :data-testid="props.testId" class="size-9">
    <slot/>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click']);

interface Props {
  testId: string;
}

const props = defineProps<Props>();

function click(): void {
  emit('click');
}
</script>
