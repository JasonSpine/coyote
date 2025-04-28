<template>
  <div class="rounded-lg p-2 flex" :class="inputClass">
    <input
      class="outline-none flex-grow-1"
      :data-testid="props.testId"
      :placeholder="props.placeholder"
      :disabled="disabled"
      v-model="text"
      @keyup.enter="submit"
      @input="change">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {computed, inject} from "vue";

interface Props {
  placeholder: string;
  testId?: string;
  nested?: boolean;
  disabled?: boolean;
}

const hasError = inject('fieldHasError', computed(() => false));
const disabled = inject('fieldDisabled', computed(() => props.disabled));

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

const inputClass = computed<string>(() => {
  if (disabled.value) {
    return 'text-neutral-400 border border-neutral-100 bg-neutral-050';
  }
  if (props.nested) {
    if (hasError.value) {
      throw new Error('Nested inputs do not have errors.');
    }
    return 'bg-tile-nested';
  }
  if (hasError.value) {
    return 'border border-red-500';
  }
  return 'border border-neutral-100';
});
</script>
