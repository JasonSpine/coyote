<template>
  <JobOfferButtonPill @click="navigateHome">Wróć do ogłoszeń</JobOfferButtonPill>
  <JobOfferShow
    :job-offer="toJobOfferShow(props.jobOffer)"
    :can-edit="props.jobOffer.canEdit"
    @edit="editJob"
    @apply="applyForJob"/>
</template>

<script setup lang="ts">
import {JobOffer} from "../../../jobBoard";
import {UiController} from "../ui";
import JobOfferButtonPill from "./JobOfferButtonPill.vue";
import {toJobOfferShow} from "./JobOfferShow";
import JobOfferShow from "./JobOfferShow.vue";

const props = defineProps<Props>();

interface Props {
  uiController: UiController;
  jobOffer: JobOffer;
}

function navigateHome(): void {
  props.uiController.navigate('home', null);
}

function editJob(): void {
  props.uiController.navigate('edit', props.jobOffer.id);
}

function applyForJob(): void {
  props.uiController.applyForJob(props.jobOffer.id);
}
</script>
