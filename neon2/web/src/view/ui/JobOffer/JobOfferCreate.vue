<template>
  <JobOfferForm
    mode="create"
    :job-offer="newJobOffer"
    :job-offer-expires-in-days="expiresInDays"
    :upload="props.upload"
    :four-steps="fourSteps"
    @submit="create"
    @abort="emit('abort')"/>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {PricingPlan, SubmitJobOffer, UploadAssets} from "../../../main";
import JobOfferForm from "./JobOfferForm.vue";

interface Props {
  upload: UploadAssets;
  pricingPlan: PricingPlan;
}

interface Emit {
  (event: 'create', jobOffer: SubmitJobOffer): void;
  (event: 'abort'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

function create(jobOffer: SubmitJobOffer): void {
  emit('create', jobOffer);
}

const expiresInDays = computed(() => props.pricingPlan === 'free' ? 14 : 30);
const fourSteps = computed(() => props.pricingPlan !== 'free');

const newJobOffer: SubmitJobOffer = {
  title: '',
  description: null,
  companyName: '',
  salaryRangeFrom: null,
  salaryRangeTo: null,
  salaryIsNet: true,
  salaryCurrency: 'PLN',
  salaryRate: 'monthly',
  locations: [],
  companyLogoUrl: null,
  tagNames: [],
  workMode: 'stationary',
  legalForm: 'employment',
  experience: 'not-provided',
  applicationMode: '4programmers',
  applicationExternalAts: null,
  applicationEmail: null,
  companyHiringType: 'direct',
  companyFundingYear: null,
  companySizeLevel: null,
  companyAddress: null,
  companyVideoUrl: null,
  companyDescription: null,
  companyWebsiteUrl: null,
  companyPhotoUrl: null,
};
</script>
