<template>
  <div class="flex items-center cursor-pointer" @click="select">
    <div class="size-8 flex-shrink-0 rounded-lg mr-3 flex items-center justify-center font-semibold" :class="iconClass">
      <Icon name="jobOfferStepperStepFinished" v-if="mode==='previous'"/>
      <template v-else>{{props.counter}}</template>
    </div>
    <span :class="titleClass" v-text="props.title"/>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import Icon from "../icons/Icon.vue";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  counter: number;
  title: string;
  mode: StepMode;
}

export type StepMode = 'previous'|'current'|'next';

interface Emit {
  (event: 'select');
}

function select(): void {
  emit('select');
}

const iconClass = computed(() => {
  if (props.mode === 'next') {
    return 'text-navy-600 bg-navy-100';
  }
  return 'bg-green-500 text-white';
});

const titleClass = computed(() => {
  if (props.mode === 'current') {
    return 'font-semibold';
  }
  return '';
});
</script>
