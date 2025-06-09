<template>
  <Dropdown
    scroll="scrollablePadding"
    :nested="nested"
    :test-id="props.testId"
    :title="props.title"
    :icon="props.icon"
    :blip="valuesCount"
    :open-to-left="props.openToLeft">
    <div v-if="search" class="cursor-default">
      <TextField
        gain-focus
        placeholder="Wyszukaj..."
        @keydown.esc="searchPhrase = ''"
        v-model="searchPhrase"/>
    </div>
    <CheckBox
      v-for="option in filteredOptions"
      :key="option.value"
      :label="option.title"
      :icon="option.icon"
      :model-value="selected(option.value)"
      @update:model-value="newValue => toggle(option.value, newValue)"/>
    <span v-if="allFilteredOut" class="text-neutral2-500">
      Brak ofert z "{{searchPhrase.trim()}}".
    </span>
  </Dropdown>
</template>

<script setup lang="ts" generic="T extends string">
import {computed, ref} from "vue";
import {IconName} from "../icons/icons";
import CheckBox from "./CheckBox.vue";
import Dropdown from "./Dropdown.vue";
import {DropdownOption} from "./DropdownOption";
import TextField from "./TextField.vue";

const props = defineProps<Props>();
const model = defineModel<T[]>({type: Array, required: true});

interface Props {
  nested?: boolean;
  testId?: string;
  title: string;
  icon: IconName;
  options: DropdownOption<T>[];
  blip?: string;
  openToLeft?: boolean;
  search?: boolean;
}

function selected(value: T): boolean {
  return model.value.includes(value);
}

function toggle(value: T, checked: boolean): void {
  if (checked) {
    model.value.push(value);
  } else {
    model.value.splice(model.value.indexOf(value), 1);
  }
  searchPhrase.value = '';
}

const valuesCount = computed((): string|undefined => {
  if (model.value.length === 0) {
    return undefined;
  }
  return model.value.length.toString();
});

const searchPhrase = ref<string>('');

const filteredOptions = computed(() => {
  return props.options
    .filter(option => matchesSearchPhrase(option))
    .toSorted((a, b): number => sortSelectedFirsts(a, b));
});

function sortSelectedFirsts(a: DropdownOption<T>, b: DropdownOption<T>): number {
  if (selected(a.value) === selected(b.value)) {
    return 0;
  }
  return selected(a.value) ? -1 : 1;
}

function matchesSearchPhrase(option: DropdownOption<T>): boolean {
  return option.title.toLowerCase().includes(searchPhrase.value.toLowerCase().trim());
}

const allFilteredOut = computed((): boolean => {
  return filteredOptions.value.length === 0;
});
</script>
