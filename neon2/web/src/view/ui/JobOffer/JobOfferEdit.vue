<template>
  <JobOfferForm
    mode="update"
    :job-offer="props.jobOffer"
    :upload="props.upload"
    @submit="update"/>
</template>

<script setup lang="ts">
import {SubmitJobOffer, UploadImage} from "../../../main";
import JobOfferForm from "./JobOfferForm.vue";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  id: number;
  jobOffer: SubmitJobOffer;
  upload: UploadImage;
}

interface Emit {
  (event: 'update', id: number, jobOffer: SubmitJobOffer): void;
}

function update(jobOffer: SubmitJobOffer): void {
  emit('update', props.id, jobOffer);
}
</script>
