<template>
  <Design.Tile class="p-4 md:p-8">
    <div :class="[
      'h-16 rounded-lg -m-2 md:-m-6 mb-0',
      'bg-linear-to-r from-green-050 dark:from-green-800 to-tile'
    ]"/>
    <Design.Row vertical-center class="-mt-7 mb-8">
      <Design.Image
        border
        :src="props.jobOffer.companyLogoUrl"
        placeholder-icon="jobOfferLogoPlaceholder"
        class="mr-auto"/>
      <Design.Button square icon="jobOfferFavourite"/>
      <Design.Button @click="editJob" v-if="props.canEdit">Edytuj</Design.Button>
      <Design.Button :primary="!props.preview" :primary-outline="props.preview" @click="apply">
        Aplikuj
      </Design.Button>
    </Design.Row>
    <div class="mb-8 md:flex md:justify-between md:items-start max-md:mb-12 max-md:space-y-6">
      <div>
        <h1
          class="text-2xl md:text-3xl md:mb-2 font-medium text-neutral2-900"
          v-text="props.jobOffer.title"/>
        <h2
          class="text-lg text-neutral2-900"
          v-text="props.jobOffer.companyName"
          data-testid="jobOfferCompanyName"/>
      </div>
      <JobOfferSalary :salary="salary" nowrap v-if="salary"/>
    </div>
    <div class="md:flex max-md:space-y-12">
      <div :class="[
          'md:w-2/3 pr-8',
          'text-neutral2-700',
          'job-offer-description list-style paragraph-style'
        ]">
        <div
          v-if="props.jobOffer.description"
          data-testid="jobOfferDescription"
          v-html="props.jobOffer.description"/>
        <template v-if="props.jobOffer.companyDescription">
          <p><b>O firmie</b></p>
          <div v-html="props.jobOffer.companyDescription"/>
        </template>
      </div>
      <div class="md:w-1/3 space-y-3">
        <Design.Card space border>
          <JobOfferField
            title="Tryb pracy"
            :value="formatWorkMode(props.jobOffer.workMode)"
            icon="jobOfferWorkModeRemote"/>
          <JobOfferField
            title="Lokalizacja"
            :value="props.jobOffer.locationCities.join(', ')"
            v-if="props.jobOffer.locationCities.length"
            icon="jobOfferLocation"/>
          <JobOfferField
            title="Rodzaj umowy"
            :value="formatLegalForm(props.jobOffer.legalForm)"
            icon="jobOfferLegalForm"/>
          <JobOfferField
            title="Poziom Doświadczenia"
            :value="formatWorkExperience(props.jobOffer.experience)"
            v-if="props.jobOffer.experience !== 'not-provided'"
            icon="jobOfferWorkExperience"/>
          <JobOfferField
            title="Wygasa"
            :value="formatExpiresInDays(props.jobOffer.expiresInDays)"
            v-if="props.jobOffer.expiresInDays"
            test-id="jobOfferExpiresInDays"/>
          <Design.Button :primary="!props.preview" :primary-outline="props.preview" full-width @click="apply">
            Aplikuj
          </Design.Button>
        </Design.Card>
        <Design.Card space border v-if="props.jobOffer.tagNames.length">
          <JobOfferField title="Technologie">
            <JobOfferTagList :tag-names="props.jobOffer.tagNames" :max="20"/>
          </JobOfferField>
        </Design.Card>
        <Design.Card space border v-if="companyCard">
          <JobOfferField
            title="Nazwa firmy"
            :value="props.jobOffer.companyName"
            v-if="props.jobOffer.companyName"/>
          <JobOfferField
            link
            icon="jobOfferCompanyWebsite"
            title="Witryna firmy"
            :value="props.jobOffer.companyWebsiteUrl"
            v-if="props.jobOffer.companyWebsiteUrl"/>
          <JobOfferField
            icon="jobOfferCompanyFundingYear"
            title="Rok założenia firmy"
            :value="props.jobOffer.companyFundingYear.toString()"
            v-if="props.jobOffer.companyFundingYear"/>
          <JobOfferField
            icon="jobOfferCompanySize"
            title="Rozmiar firmy"
            :value="formatCompanySizeLevel(props.jobOffer.companySizeLevel)"
            v-if="props.jobOffer.companySizeLevel"/>
        </Design.Card>
      </div>
    </div>
  </Design.Tile>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {Design} from "../design/design";
import {
  formatCompanySizeLevel,
  formatExpiresInDays,
  formatLegalForm,
  formatWorkExperience,
  formatWorkMode,
} from "./format";
import JobOfferField from "./JobOfferField.vue";
import JobOfferSalary, {SalaryJobOffer} from "./JobOfferSalary.vue";
import {JobOfferShow} from "./JobOfferShow";
import JobOfferTagList from "./JobOfferTagList.vue";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOffer: JobOfferShow;
  preview?: boolean;
  canEdit: boolean;
}

interface Emit {
  (event: 'edit'): void;
  (event: 'apply'): void;
}

function editJob(): void {
  emit('edit');
}

function apply(): void {
  emit('apply');
}

const salary = computed<SalaryJobOffer|null>(() => {
  if (props.jobOffer.salaryRangeFrom && props.jobOffer.salaryRangeTo) {
    return {...props.jobOffer} as SalaryJobOffer;
  }
  return null;
});

const companyCard = computed<boolean>((): boolean => {
  return !!props.jobOffer.companyWebsiteUrl ||
    !!props.jobOffer.companyFundingYear ||
    !!props.jobOffer.companySizeLevel ||
    !!props.jobOffer.companyName;
});
</script>

<style>
@import "../../ui/design/tailwind.css";

.job-offer-description b {
  @apply text-neutral2-800;
}
</style>
