<template>
  <Design.Stepper
    :step="props.step"
    :steps="[
      {title:'Informacje o firmie', value:'company'},
      {title:'Kreator oferty pracy', value:'jobOffer'},
      {title:'Podgląd oferty', value:'preview'},
      {title:'Publikacja ogłoszenia', value:'publish'},
    ]"/>
</template>

<script setup lang="ts">
import {Design} from "../design";

export type JobOfferStep = 'company'|'jobOffer'|'preview'|'publish';

interface Props {
  step: JobOfferStep;
}

const props = defineProps<Props>();
</script>
