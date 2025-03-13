<template>
  <div class="flex items-center">
    <div
      class="size-5 rounded flex items-center justify-center transition duration-200 cursor-pointer"
      :class="checked ? 'bg-green-500 text-white' : 'bg-navy-050 border-1 border-navy-100'"
      :data-testid="props.testId"
      @click="toggle">
      <Icon name="checkboxChecked" v-if="checked"/>
    </div>
    <Icon v-if="props.icon" @click="toggle" class="ml-2 cursor-pointer" :name="props.icon"/>
    <label v-if="props.label" @click="toggle" class="ml-2 cursor-pointer" v-text="props.label"/>
  </div>
</template>

<script setup lang="ts">
import Icon, {IconName} from "../component/Icon.vue";

interface Props {
  label: string;
  icon?: IconName;
  testId?: string;
}

const props = defineProps<Props>();
const checked = defineModel({default: false});

function toggle(): void {
  checked.value = !checked.value;
}
</script>
