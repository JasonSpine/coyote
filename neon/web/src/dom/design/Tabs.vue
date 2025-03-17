<template>
  <div class="flex">
    <div
      v-for="tab in props.tabs"
      v-text="tab.title"
      class="px-4 py-3"
      :class="[
        selected(tab) ? 'border-b-2 border-primary' : '',
        selected(tab) ? 'cursor-default' : 'cursor-pointer',
      ]"
      @click="change(tab)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  selected: string;
  tabs: Tab[];
}

interface Tab {
  value: string;
  title: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['change']);

function selected(tab: Tab): boolean {
  return tab.value === props.selected;
}

function change(tab: Tab): void {
  if (!selected(tab)) {
    emit('change', tab.value);
  }
}
</script>
