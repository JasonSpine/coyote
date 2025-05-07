<template>
  <div class="rounded-lg p-2 flex" :class="inputClass">
    <Icon :name="props.icon"
          v-if="props.icon"
          :class="['mr-2', {'text-red-500': hasError}]"/>
    <TextInput
      class="outline-none flex-grow-1"
      :type="props.formatHtml ? 'html' : 'plain'"
      :label-id="fieldLabelId"
      :test-id="props.testId"
      :placeholder="props.placeholder"
      :disabled="disabled"
      v-model="text"/>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {computed, inject} from "vue";
import Icon from '../icons/Icon.vue';
import {IconName} from "../icons/icons";
import TextInput from "./TextInput.vue";

interface Props {
  placeholder: string;
  testId?: string;
  nested?: boolean;
  disabled?: boolean;
  formatHtml?: boolean;
  icon?: IconName;
}

const hasError = inject('fieldHasError', computed(() => false));
const disabled = inject('fieldDisabled', computed(() => props.disabled));
const fieldLabelId = inject('fieldLabelId', undefined);

const props = defineProps<Props>();
const text = defineModel<string>({default: ''});

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
