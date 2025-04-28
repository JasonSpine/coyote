<template>
  <JobOfferForm
    mode="update"
    :job-offer="props.jobOffer"
    :job-offer-expires-in-days="props.jobOfferExpiresInDays"
    :upload="props.upload"
    :four-steps="false"
    @submit="update"
    @abort="emit('abort')"/>
</template>

<script setup lang="ts">
import {SubmitJobOffer, UploadAssets} from "../../../main";
import JobOfferForm from "./JobOfferForm.vue";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  id: number;
  jobOffer: SubmitJobOffer;
  jobOfferExpiresInDays: number;
  upload: UploadAssets;
}

interface Emit {
  (event: 'update', id: number, jobOffer: SubmitJobOffer): void;
  (event: 'abort'): void;
}

function update(jobOffer: SubmitJobOffer): void {
  emit('update', props.id, jobOffer);
}
</script>
