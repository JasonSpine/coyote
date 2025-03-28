<template>
  <Design.JobOfferBadge color="primary">
    {{ salaryRange }}
    {{ props.salary.currency }}
    {{ props.salary.isNet ? 'netto' : '' }}
    {{ rateTitle }}
  </Design.JobOfferBadge>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Rate} from "../../filters";
import {VueSalary} from "../JobBoard.vue";
import {Design} from "./design";

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
    return formatNumber(props.salary.from);
  }
  return `${formatNumber(props.salary.from)} - ${formatNumber(props.salary.to)}`;
});

function formatNumber(number: number): string {
  return addThousandSeparator(number, ' ');
}

function addThousandSeparator(number: number, separator: string) {
  const digits = number.toString();
  if (digits.length > 3) {
    return digits.substring(0, digits.length - 3) + separator + digits.substring(digits.length - 3);
  }
  return digits;
}
</script>
