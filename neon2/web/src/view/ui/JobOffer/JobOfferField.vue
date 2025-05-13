<template>
  <div>
    <p v-text="props.title" class="text-sm text-neutral-400 dark:text-neutral-300 mb-1"/>
    <Icon :name="props.icon" v-if="props.icon" class="mr-2"/>
    <span
      class="text-neutral-600 dark:text-neutral-050"
      :data-testid="props.testId"
      v-if="props.value">
      <a v-if="props.link" v-text="displayLink(props.value)" :href="props.value"/>
      <span v-else v-text="props.value"/>
    </span>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import Icon from "../icons/Icon.vue";
import {IconName} from "../icons/icons";

interface Props {
  title: string;
  icon?: IconName;
  value?: string;
  testId?: string;
  link?: boolean;
}

const props = defineProps<Props>();

function displayLink(url: string): string {
  return new URL(url).hostname;
}
</script>
