<template>
  <Design.Stepper
    :step="props.step"
    :steps="[
      {title:'Informacje o firmie', value:'company'},
      {title:'Szczegóły ogłoszenia', value:'jobOffer'},
      {title:'Podgląd oferty', value:'preview'},
      {title:'Publikacja ogłoszenia', value:'publish'},
    ]"/>
</template>

<script setup lang="ts">
import {Design} from "../design";

export type JobOfferCreatorStep = 'company'|'jobOffer'|'preview';
export type JobOfferStep = JobOfferCreatorStep|'publish';

interface Props {
  step: JobOfferStep;
}

const props = defineProps<Props>();
</script>
