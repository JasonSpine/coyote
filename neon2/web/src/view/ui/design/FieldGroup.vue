<template>
  <div class="flex-1">
    <label>
      <Design.FieldLabel :title="props.label"/>
      <slot/>
    </label>
  </div>
</template>

<script setup lang="ts">
import {Design} from "./design";

interface Props {
  label: string;
}

const props = defineProps<Props>();
</script>
