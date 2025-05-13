<template>
  <button @click="emit('click')" :class="[
    'font-medium cursor-pointer',
    'rounded-lg px-4 py-2',
    'border border-navy-100',
    'flex items-center gap-2',
  ]">
    <Icon name="jobOfferCreatorStepBack"/>
    <slot/>
  </button>
</template>

<script setup lang="ts">
import Icon from "../icons/Icon.vue";

const emit = defineEmits(['click']);
</script>
