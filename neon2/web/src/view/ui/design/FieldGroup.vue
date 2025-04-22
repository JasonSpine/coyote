<template>
  <div class="flex-1">
    <label>
      <Design.FieldLabel :title="props.label" :required="props.required"/>
      <slot/>
    </label>
  </div>
</template>

<script setup lang="ts">
import {Design} from "./design";

interface Props {
  label: string;
  required?: boolean;
}

const props = defineProps<Props>();
</script>
