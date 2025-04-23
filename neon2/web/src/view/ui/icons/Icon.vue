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

const iconCheck = 'fa-light fa-check';
const iconPlus = 'fa-light fa-plus';
const iconClose = 'fa-light fa-close';
const iconSuitcase = 'fa-light fa-suitcase';

const jobOfferLocation = 'fa-light fa-location-dot';
const jobOfferLegalForm = iconSuitcase;
const jobOfferWorkModeStationary = iconSuitcase;
const jobOfferWorkModeHybrid = 'fa-light fa-globe-wifi';
const jobOfferWorkModeRemote = 'fa-solid fa-wifi';
const jobOfferWorkExperience = 'fa-light fa-chart-line';

const icons = {
  dropdownClosed: 'fa-light fa-chevron-down',
  dropdownOptionSelected: iconCheck,
  checkboxChecked: iconCheck,
  add: iconPlus,
  toastClose: iconClose,
  toastInfo: 'fa-light fa-circle-info',
  jobOfferFavourite: 'fa-light fa-star',
  jobOfferFavouriteChecked: 'fa-solid fa-star',
  jobOfferWorkModeRemote,
  jobOfferWorkModeHybrid,
  jobOfferWorkModeStationary,
  jobOfferComments: 'fa-light fa-comment',
  jobOfferLocation,
  jobOfferCompany: 'fa-light fa-building',
  jobOfferCompanyWebsite: 'fa-light fa-link',
  jobOfferCompanyFundingYear: 'fa-light fa-calendar',
  jobOfferCompanySize: 'fa-light fa-users',
  jobOfferLogoPlaceholder: 'fa-light fa-laptop-code',
  jobOfferSearch: 'fa-regular fa-magnifying-glass',
  jobOfferWorkExperience,
  jobOfferLegalForm,
  jobOfferFilter: 'fa-light fa-filter',
  jobOfferFilterClose: iconClose,
  jobOfferFilterTechnology: 'fa-light fa-code',
  jobOfferFilterLocation: jobOfferLocation,
  jobOfferFilterWorkMode: 'fa-light fa-globe',
  jobOfferFilterSalary: 'fa-light fa-sack-dollar',
  jobOfferFilterCurrency: 'fa-light fa-coins',
  jobOfferFilterSort: 'fa-light fa-bars-sort',
  jobOfferFilterLegalForm: jobOfferLegalForm,
  jobOfferFilterWorkExperience: jobOfferWorkExperience,
  jobOfferUploadCompanyLogo: 'fa-light fa-circle-plus',
  jobOfferStepperStepFinished: iconCheck,
};

const fontAwesomeClasses = computed<string>((): string => icons[props.name]);
</script>
