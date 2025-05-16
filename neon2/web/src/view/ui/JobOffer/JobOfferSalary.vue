<template>
  <JobOfferBadge color="primary" :nowrap="props.nowrap">
    {{salaryRange}}
    {{props.salary.salaryCurrency}}
    {{props.salary.salaryIsNet ? 'netto' : 'brutto'}}
    {{rateTitle}}
  </JobOfferBadge>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Currency, Rate} from "../../../main";
import JobOfferBadge from "./JobOfferBadge.vue";

export interface SalaryJobOffer {
  salaryRangeFrom: number;
  salaryRangeTo: number;
  salaryIsNet: boolean;
  salaryCurrency: Currency;
  salaryRate: Rate;
}

interface Props {
  salary: SalaryJobOffer;
  nowrap?: boolean;
}

const props = defineProps<Props>();

const rateTitle = computed((): string => {
  const titles: Record<Rate, string> = {
    'hourly': '/ h',
    'weekly': '/ tygodniowo',
    'monthly': '',
    'yearly': '/ rocznie',
  };
  return titles[props.salary.salaryRate];
});

const salaryRange = computed((): string => {
  if (props.salary.salaryRangeFrom === props.salary.salaryRangeTo) {
    return formatNumber(props.salary.salaryRangeFrom);
  }
  return `${formatNumber(props.salary.salaryRangeFrom)} - ${formatNumber(props.salary.salaryRangeTo)}`;
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
