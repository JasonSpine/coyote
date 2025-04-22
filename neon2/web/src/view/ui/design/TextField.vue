<template>
  <div class="rounded-lg p-2 flex" :class="inputClass">
    <input
      class="outline-none flex-grow-1"
      :data-testid="props.testId"
      :placeholder="props.placeholder"
      v-model="text"
      @keyup.enter="submit"
      @input="change">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

interface Props {
  placeholder: string;
  testId?: string;
  nested?: boolean;
}

interface Emit {
  (event: 'submit', value: string): void;
  (event: 'change', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();
const text = defineModel<string>({default: ''});

function submit(): void {
  emit('submit', text.value);
}

function change(): void {
  emit('change', text.value);
}

const inputClass = computed(() => {
  if (props.nested) {
    return 'bg-tile-nested';
  }
  return 'border border-neutral-100';
});
</script>
