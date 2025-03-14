<template>
  <Design.Drawer
    :title="props.title"
    :icon="props.icon"
    :test-id="props.testId"
    :nested="props.nested"
    v-model:open="open">
    <div v-for="option in options" @click="select(option.value)" class="cursor-pointer text-nowrap">
      <Icon v-if="selected === option.value" name="dropdownOptionSelected" class="text-primary mr-1"/>
      {{ option.title }}
    </div>
  </Design.Drawer>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import Icon, {IconName} from "../component/Icon.vue";
import {Design} from "./design";

interface DrawerOption {
  value: string;
  title: string;
}

type DrawerOptions = DrawerOption[]|string[];

interface Props {
  title: string;
  icon?: IconName;
  testId?: string;
  nested?: boolean;
  options: DrawerOptions;
}

const props = defineProps<Props>();
const selected = defineModel({type: String});
const open = ref<boolean>(false);

function select(value: string): void {
  selected.value = value;
  open.value = false;
}

const options = computed<VueOption[]>(() => {
  return props.options.map(function (option: DrawerOption|string): DrawerOption {
    if (typeof option === 'string') {
      return {value: option, title: option};
    }
    return option;
  });
});
</script>
