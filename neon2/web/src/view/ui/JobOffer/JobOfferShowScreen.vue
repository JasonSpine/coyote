<template>
  <JobOfferButtonPill @click="navigateHome">Wróć do ogłoszeń</JobOfferButtonPill>
  <JobOfferShow :job-offer="props.jobOffer" @edit="editJob" @apply="applyForJob"/>
</template>

<script setup lang="ts">
import {UiController} from "../ui";
import JobOfferButtonPill from "./JobOfferButtonPill.vue";
import {JobOfferShow as JobOffer} from "./JobOfferShow";
import JobOfferShow from "./JobOfferShow.vue";

const props = defineProps<Props>();

interface Props {
  uiController: UiController;
  id: number;
  jobOffer: JobOffer;
}

function navigateHome(): void {
  props.uiController.navigate('home', null);
}

function editJob(): void {
  props.uiController.navigate('edit', props.id);
}

function applyForJob(): void {
  props.uiController.applyForJob(props.id);
}
</script>
