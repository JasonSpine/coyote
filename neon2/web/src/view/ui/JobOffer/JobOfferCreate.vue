<template>
  <JobOfferForm
    mode="create"
    :job-offer="newJobOffer"
    :job-offer-expires-in-days="expiresInDays"
    :upload="props.upload"
    :four-steps="fourSteps"
    @submit="create"
    @abort="props.uiController.navigate('pricing', null)"/>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {PricingPlan, SubmitJobOffer, UploadAssets} from "../../../main";
import {UiController, ViewListener} from "../ui";
import JobOfferForm from "./JobOfferForm.vue";

const props = defineProps<Props>();

interface Props {
  uiController: UiController;
  viewListener: ViewListener;
  upload: UploadAssets;
  pricingPlan: PricingPlan;
  applicationEmail: string;
}

function create(jobOffer: SubmitJobOffer): void {
  props.viewListener.createJob(props.pricingPlan, jobOffer);
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
  applicationEmail: props.applicationEmail,
  companyHiringType: 'direct',
  companyFundingYear: null,
  companySizeLevel: null,
  companyAddress: null,
  companyVideoUrl: null,
  companyDescription: null,
  companyWebsiteUrl: null,
  companyPhotoUrls: [],
};
</script>
