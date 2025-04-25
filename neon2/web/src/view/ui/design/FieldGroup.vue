<template>
  <div class="flex-1">
    <label>
      <Design.FieldLabel
        :has-error="!!props.error"
        :title="props.label"
        :required="props.required"/>
      <slot/>
    </label>
    <Design.FieldError :message="props.error" v-if="props.error"/>
  </div>
</template>

<script setup lang="ts">
import {computed, provide} from "vue";
import {Design} from "./design";

interface Props {
  label: string;
  required?: boolean;
  error?: string|null;
}

const props = defineProps<Props>();

provide('fieldHasError', computed(() => !!props.error));
</script>
