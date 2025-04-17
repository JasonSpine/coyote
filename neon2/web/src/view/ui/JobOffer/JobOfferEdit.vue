<template>
  <JobOfferForm
    mode="update"
    :job-offer="props.jobOffer"
    @submit="update"/>
</template>

<script setup lang="ts">
import {SubmitJobOffer} from "../../../main";
import JobOfferForm from "./JobOfferForm.vue";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  id: number;
  jobOffer: SubmitJobOffer;
}

interface Emit {
  (event: 'update', id: number, jobOffer: SubmitJobOffer): void;
}

function update(jobOffer: SubmitJobOffer): void {
  emit('update', props.id, jobOffer);
}
</script>
