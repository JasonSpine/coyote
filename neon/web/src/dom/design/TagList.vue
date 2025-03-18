<template>
  <span class="flex flex-wrap gap-x-2 gap-y-1">
    <span v-for="tag in visibleTags" v-text="tag" class="bg-tag px-2 rounded"/>
    <span v-if="hiddenTags">+{{ hiddenTags }}</span>
  </span>
</template>

<script setup lang="ts">
import {computed} from "vue";

interface Props {
  tagNames: string[];
  max: number;
}

const props = defineProps<Props>();

const visibleTags = computed(() => props.tagNames.slice(0, props.max));
const hiddenTags = computed(() => Math.max(0, props.tagNames.length - props.max));
</script>
