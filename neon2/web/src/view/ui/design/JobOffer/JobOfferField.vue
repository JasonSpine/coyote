<template>
  <div>
    <p v-text="props.title" class="text-sm text-neutral-400 dark:text-neutral-300 mb-1"/>
    <Icon :name="props.icon" v-if="props.icon" class="mr-2"/>
    <span 
      class="text-neutral-600 dark:text-neutral-050"
      v-text="props.value" 
      :data-testid="props.testId"
      v-if="props.value"/>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import Icon, {IconName} from "../../icons/Icon.vue";

interface Props {
  title: string;
  icon?: IconName;
  value?: string;
  testId?: string;
}

const props = defineProps<Props>();
</script>
