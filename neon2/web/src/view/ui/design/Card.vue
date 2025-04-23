<template>
  <Design.Tile vertical space :big-space="props.space" :class="border">
    <p
      class="text-lg font-semibold text-neutral-800 dark:text-neutral-200"
      v-text="props.title"
      v-if="props.title"/>
    <slot/>
  </Design.Tile>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Design} from "./design";

const props = defineProps<Props>();

interface Props {
  title?: string;
  space?: boolean;
  border?: boolean;
}

const border = computed(() => {
  if (props.border) {
    return 'rounded-lg border border-neutral-050 dark:border-neutral-700';
  }
  return '';
});
</script>
