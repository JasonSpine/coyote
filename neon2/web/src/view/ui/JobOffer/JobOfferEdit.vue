<template>
  <JobOfferForm
    mode="update"
    :job-offer="props.jobOffer"
    :job-offer-expires-in-days="props.jobOfferExpiresInDays"
    :upload="props.upload"
    :four-steps="false"
    @submit="update"
    @abort="abort"/>
</template>

<script setup lang="ts">
import {SubmitJobOffer, UploadAssets} from "../../../main";
import {UiController, ViewListener} from "../ui";
import JobOfferForm from "./JobOfferForm.vue";

const props = defineProps<Props>();

interface Props {
  uiController: UiController;
  viewListener: ViewListener;
  id: number;
  jobOffer: SubmitJobOffer;
  jobOfferExpiresInDays: number;
  upload: UploadAssets;
}

function update(jobOffer: SubmitJobOffer): void {
  props.viewListener.updateJob(props.id, jobOffer);
}

function abort(): void {
  props.uiController.navigate('show', props.id);
}
</script>
