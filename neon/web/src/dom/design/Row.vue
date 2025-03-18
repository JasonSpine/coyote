<template>
  <div class="flex flex-wrap" :class="[
    props.space ? 'gap-4' : 'gap-2',
    props.verticalCenter ?  'items-center' : '',
    props.apart ? 'justify-between' : '',
  ]">
    <slot/>
  </div>
</template>

<script setup lang="ts">
interface Props {
  space?: boolean;
  verticalCenter?: boolean;
  apart?: boolean;
}

const props = defineProps<Props>();
</script>
