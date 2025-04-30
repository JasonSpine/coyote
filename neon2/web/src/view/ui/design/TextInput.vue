<template>
  <input
    v-if="props.component === 'input'"
    v-model="model"
    :placeholder="props.placeholder"
    :data-testid="props.testId"
    :disabled="props.disabled"
    :id="props.labelId"
    @keyup.enter="submit"
    @input="change"/>
  <textarea
    v-else
    v-model="model"
    :placeholder="props.placeholder"
    :data-testid="props.testId"
    :disabled="props.disabled"
    :id="props.labelId"
    @keyup.enter="submit"
    @input="change"/>
</template>

<script setup lang="ts">
const props = defineProps<Props>();
const emit = defineEmits<Emit>();
const model = defineModel<string>({required: true});

interface Props {
  component: 'input'|'textarea';
  placeholder: string;
  testId?: string;
  disabled?: boolean;
  labelId?: string;
}

interface Emit {
  (event: 'submit', value: string): void;
  (event: 'change', value: string): void;
}

function submit(): void {
  emit('submit', model.value);
}

function change(): void {
  emit('change', model.value);
}
</script>
