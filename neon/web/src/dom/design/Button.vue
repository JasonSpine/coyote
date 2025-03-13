<template>
  <button
    @click="click"
    class="cursor-pointer rounded-lg px-4 py-2"
    :class="variantClass"
    :data-testid="props.testId">
    <Icon v-if="props.icon" :name="props.icon"/>
    <slot/>
  </button>
</template>

<script setup lang="ts">
import {computed} from "vue";
import Icon, {IconName} from "../component/Icon.vue";

const emit = defineEmits(['click']);

interface Props {
  testId: string;
  icon?: IconName;
  primary?: boolean;
  primaryOutline?: boolean;
}

const props = defineProps<Props>();

function click(): void {
  emit('click');
}

const variantClass = computed(() => {
  if (props.primary) {
    return 'bg-primary text-on-primary';
  }
  if (props.primaryOutline) {
    return 'text-primary bg-tile border border-primary';
  }
  return '';
});
</script>
