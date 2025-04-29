<template>
  <span class="p-1.5 rounded-lg" :class="[
    colorClass, 
    {'text-sm':props.textSmall}, 
    {'whitespace-nowrap': props.nowrap}]">
    <slot/>
  </span>
</template>

<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<Props>();

interface Props {
  color: BadgeColor;
  textSmall?: boolean;
  nowrap?: boolean;
}

type BadgeColor = 'primary'|'pink'|'gray';

const colorClass = computed((): string => {
  const classes: Record<BadgeColor, string> = {
    primary: 'bg-accent-back text-accent-front',
    gray: 'bg-navy-100 text-neutral-600 dark:bg-neutral-950 dark:text-neutral-400',
    pink: 'bg-[#e2d2f9] text-[#16062d] dark:bg-[#16062d] dark:text-[#b68cf6]',
  };
  return classes[props.color];
});
</script>
