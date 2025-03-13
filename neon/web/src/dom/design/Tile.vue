<template>
  <div :class="tileClass" :data-testid="props.testId">
    <Icon v-if="props.icon" :name="props.icon" class="mr-2"/>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import Icon, {IconName} from "../component/Icon.vue";

interface Props {
  nested?: boolean;
  icon?: IconName;
  testId?: string;
  nestedPill?: boolean;
  space?: boolean;
}

const props = defineProps<Props>();
const tileClass = computed(() => {
  if (props.nestedPill) {
    return 'bg-tile-nested rounded-3xl py-2 px-3';
  }
  if (props.nested) {
    return 'bg-tile-nested rounded-lg p-2';
  }
  if (props.space) {
    return 'bg-tile rounded-xl space-y-4 p-4';
  }
  return 'bg-tile rounded-xl space-y-2 p-2';
});
</script>
