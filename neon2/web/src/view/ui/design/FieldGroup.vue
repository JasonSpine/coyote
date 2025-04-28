<template>
  <div class="flex-1">
    <label>
      <Design.FieldLabel
        :has-error="hasError"
        :title="props.label"
        :required="props.required"
        :disabled="props.disabled"/>
      <slot/>
    </label>
    <Design.FieldError v-if="hasError" :message="props.error!"/>
  </div>
</template>

<script setup lang="ts">
import {computed, provide} from "vue";
import {Design} from "./design";

interface Props {
  label: string;
  required?: boolean;
  error?: string|null;
  disabled?: boolean;
}

const props = defineProps<Props>();

const hasError = computed((): boolean => {
  if (props.disabled) {
    return false;
  }
  return !!props.error;
});

provide('fieldHasError', hasError);
provide('fieldDisabled', computed(() => props.disabled));
</script>
