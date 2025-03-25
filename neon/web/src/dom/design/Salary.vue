<template>
  <div class="bg-accent-back text-accent-front p-2 rounded-lg">
    {{ salaryRange }}
    {{ props.salary.currency }}
    {{ props.salary.isNet ? 'netto' : '' }}
    {{ rateTitle }}
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Rate} from "../../filters";
import {VueSalary} from "../JobBoard.vue";

interface Props {
  salary: VueSalary;
}

const props = defineProps<Props>();

const rateTitle = computed((): string => {
  const titles: Record<Rate, string> = {
    'hourly': '/ h',
    'weekly': '/ tygodniowo',
    'monthly': '',
    'yearly': '/ rocznie',
  };
  return titles[props.salary.rate];
});

const salaryRange = computed((): string => {
  if (props.salary.from === props.salary.to) {
    return props.salary.from.toString();
  }
  return `${props.salary.from} - ${props.salary.to}`;
});
</script>
