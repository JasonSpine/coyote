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
        ref="searchField"
        placeholder="Wyszukaj..."
        @keydown.esc="searchPhrase = ''"
        v-model="searchPhrase"/>
    </div>
    <div class="flex gap-2 flex-wrap max-w-50" v-if="search && model.length">
      <TagName v-for="option in model" @click="toggle(option, false)">
        {{option}}
        <Icon name="remove"/>
      </TagName>
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
import Icon from "../icons/Icon.vue";
import {IconName} from "../icons/icons";
import CheckBox from "./CheckBox.vue";
import Dropdown from "./Dropdown.vue";
import {DropdownOption} from "./DropdownOption";
import TagName from "./TagName.vue";
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
}

const valuesCount = computed((): string|undefined => {
  if (model.value.length === 0) {
    return undefined;
  }
  return model.value.length.toString();
});

const searchPhrase = ref<string>('');
const searchField = ref<HTMLInputElement>();

const filteredOptions = computed((): DropdownOption<T>[] => {
  const tags = tagsInSearchPhrase(searchPhrase.value.toLowerCase());
  if (!tags.length) {
    return props.options;
  }
  return tags.flatMap(tag => {
    return props.options
      .filter(option => option.title.toLowerCase().includes(tag))
      .toSorted((a, b): number => searchScore(a.title, tag) - searchScore(b.title, tag));
  });
});

function searchScore(item: string, searchPhrase: string): number {
  return item.indexOf(searchPhrase);
}

function tagsInSearchPhrase(searchPhrase: string): string[] {
  return searchPhrase
    .split(/[,; ]/g)
    .map(tag => tag.trim())
    .filter(tag => tag.length);
}

const allFilteredOut = computed((): boolean => filteredOptions.value.length === 0);
</script>
