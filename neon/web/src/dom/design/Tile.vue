<template>
  <div :class="props.nested ? 'bg-body rounded p-2' : 'bg-white rounded-lg p-4 space-y-2'"
       :data-testid="props.testId">
    <Icon v-if="props.icon" :name="props.icon"/>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import Icon, {IconName} from "../component/Icon.vue";

interface Props {
  nested?: boolean;
  icon?: IconName;
  testId?: string;
}

const props = defineProps<Props>();
</script>
