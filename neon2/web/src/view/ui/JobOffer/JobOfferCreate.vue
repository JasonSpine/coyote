<template>
  <JobOfferForm
    mode="create"
    :job-offer="newJobOffer"
    :upload="props.upload"
    @submit="create"/>
</template>

<script setup lang="ts">
import {SubmitJobOffer, UploadImage} from "../../../main";
import JobOfferForm from "./JobOfferForm.vue";

interface Props {
  upload: UploadImage;
}

interface Emit {
  (event: 'create', jobOffer: SubmitJobOffer): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

function create(jobOffer: SubmitJobOffer): void {
  emit('create', jobOffer);
}

const newJobOffer: SubmitJobOffer = {
  title: '',
  description: '',
  companyName: '',
  salaryRangeFrom: 0,
  salaryRangeTo: 0,
  salaryIsNet: true,
  salaryCurrency: 'PLN',
  salaryRate: 'monthly',
  locations: [''],
  companyLogoUrl: '',
  tagNames: [''],
  workMode: 'stationary',
  legalForm: 'employment',
  experience: 'not-provided',
};
</script>
