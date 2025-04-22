<template>
  <FontAwesomeIcon
    :class="fontAwesomeClasses"
    :fixed-width="props.monospace"/>
</template>

<script setup lang="ts">
import {computed} from "vue";
import FontAwesomeIcon from "./internal/FontAwesomeIcon.vue";

export type IconName = keyof typeof icons;

const props = defineProps<Props>();

interface Props {
  name: IconName;
  monospace?: boolean;
}

const jobOfferLocation = 'fa-light fa-location-dot';
const jobOfferWorkModeStationary = 'fa-light fa-suitcase';
const jobOfferWorkModeHybrid = 'fa-light fa-globe-wifi';
const jobOfferWorkModeRemote = 'fa-solid fa-wifi';
const check = 'fa-light fa-check';
const plus = 'fa-light fa-plus';
const close = 'fa-light fa-close';

const icons = {
  dropdownClosed: 'fa-light fa-chevron-down',
  dropdownOptionSelected: check,
  checkboxChecked: check,
  add: plus,
  toastClose: close,
  toastInfo: 'fa-light fa-circle-info',
  jobOfferFavourite: 'fa-light fa-star',
  jobOfferFavouriteChecked: 'fa-solid fa-star',
  jobOfferWorkModeRemote,
  jobOfferWorkModeHybrid,
  jobOfferWorkModeStationary,
  jobOfferComments: 'fa-light fa-comment',
  jobOfferLocation,
  jobOfferCompany: 'fa-light fa-building',
  jobOfferLogoPlaceholder: 'fa-light fa-laptop-code',
  jobOfferSearch: 'fa-regular fa-magnifying-glass',
  jobOfferFilter: 'fa-light fa-filter',
  jobOfferFilterClose: close,
  jobOfferFilterTechnology: 'fa-light fa-code',
  jobOfferFilterLocation: jobOfferLocation,
  jobOfferFilterWorkMode: 'fa-light fa-globe',
  jobOfferFilterSalary: 'fa-light fa-sack-dollar',
  jobOfferFilterCurrency: 'fa-light fa-coins',
  jobOfferFilterSort: 'fa-light fa-bars-sort',
  jobOfferFilterLegalForm: 'fa-light fa-suitcase',
  jobOfferFilterWorkExperience: 'fa-light fa-chart-line',
  jobOfferUploadCompanyLogo: 'fa-light fa-circle-plus',
  jobOfferStepperStepFinished: check,
};

const fontAwesomeClasses = computed<string>((): string => icons[props.name]);
</script>
