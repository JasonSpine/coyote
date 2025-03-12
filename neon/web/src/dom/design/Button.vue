<template>
  <button
    @click="click"
    class="cursor-pointer"
    :class="{'bg-green-500 text-white px-4 py-1 rounded-lg': props.primary}"
    :data-testid="props.testId">
    <Icon v-if="props.icon" :name="props.icon"/>
    <slot/>
  </button>
</template>

<script setup lang="ts">
import Icon, {IconName} from "../component/Icon.vue";

const emit = defineEmits(['click']);

interface Props {
  testId: string;
  icon?: IconName;
  primary?: boolean;
}

const props = defineProps<Props>();

function click(): void {
  emit('click');
}
</script>
