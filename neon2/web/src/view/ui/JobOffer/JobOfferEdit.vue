<template>
  <JobOfferForm
    mode="update"
    :job-offer="toSubmitJobOffer(props.jobOffer)"
    :job-offer-expires-in-days="props.jobOffer.id"
    :upload="props.upload"
    :four-steps="false"
    @submit="update"
    @abort="abort"/>
</template>

<script setup lang="ts">
import {JobOffer} from "../../../jobBoard";
import {SubmitJobOffer, toSubmitJobOffer, UploadAssets} from "../../../main";
import {UiController, ViewListener} from "../ui";
import JobOfferForm from "./JobOfferForm.vue";

const props = defineProps<Props>();

interface Props {
  uiController: UiController;
  viewListener: ViewListener;
  jobOffer: JobOffer;
  upload: UploadAssets;
}

function update(jobOffer: SubmitJobOffer): void {
  props.viewListener.updateJob(props.jobOffer.id, jobOffer);
}

function abort(): void {
  props.uiController.showJobOffer(props.jobOffer);
}
</script>
