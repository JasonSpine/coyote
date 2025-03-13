<template>
  <Design.Tile nested class="relative">
    <div class="cursor-pointer flex" @click="toggle" :data-testid="props.testId">
      <Icon :name="props.icon" v-if="props.icon" class="mr-2"/>
      <span class="mr-2">{{ props.title }}</span>
      <Icon name="dropdownClosed" class="ml-auto"/>
    </div>
    <Design.Tile space v-if="open" class="absolute z-[1] min-w-full w-max border border-divider">
      <slot/>
    </Design.Tile>
  </Design.Tile>
</template>

<script setup lang="ts">
import Icon, {IconName} from "../component/Icon.vue";
import {Design} from "./design";

interface Props {
  title: string;
  icon?: IconName;
  testId?: string;
}

const props = defineProps<Props>();
const open = defineModel('open', {default: false, type: Boolean});

function toggle(): void {
  open.value = !open.value;
}
</script>
