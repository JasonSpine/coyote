<template>
  <div class="flex flex-wrap" :class="props.space ? 'gap-4' : 'gap-2'">
    <slot/>
  </div>
</template>

<script setup lang="ts">
interface Props {
  space?: boolean;
}

const props = defineProps<Props>();
</script>
