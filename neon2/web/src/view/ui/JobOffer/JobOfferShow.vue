<template>
  <Design.Tile big-space highlight>
    <div :class="[
      'h-16 rounded-lg -mx-4 -mt-4 mb-0',
      'bg-linear-to-r from-green-050 dark:from-green-800 to-tile from-70%'
    ]"/>
    <Design.Row vertical-center class="-mt-7 mb-8">
      <Design.Image
        border
        :src="props.jobOffer.companyLogoUrl"
        placeholder-icon="jobOfferLogoPlaceholder"
        class="mr-auto"/>
      <Design.Button square icon="jobOfferFavourite"/>
      <Design.Button @click="editJob">Edytuj</Design.Button>
      <Design.Button :primary="!props.preview" :primary-outline="props.preview">
        Aplikuj
      </Design.Button>
    </Design.Row>
    <div class="mb-8 md:flex md:justify-between md:items-start max-md:mb-4">
      <div>
        <h1 v-text="props.jobOffer.title" class="text-3xl font-medium"/>
        <h2
          class="text-neutral-400 dark:text-neutral-050"
          v-text="props.jobOffer.companyName"
          data-testid="jobOfferCompanyName"/>
      </div>
      <Design.JobOfferSalary :salary="salary" nowrap v-if="salary"/>
    </div>
    <div class="flex">
      <div class="w-2/3 pr-8 space-y-12">
        <template v-if="props.jobOffer.description">
          <Design.FieldLabel title="Opis oferty" class="mb-4"/>
          <div data-testid="jobOfferDescription" v-html="props.jobOffer.description" class="list-style paragraph-style"/>
        </template>
        <template v-if="props.jobOffer.companyDescription">
          <Design.FieldLabel title="O firmie" class="mb-4"/>
          <div v-html="props.jobOffer.companyDescription" class="list-style paragraph-style"/>
        </template>
      </div>
      <div class="w-1/3 space-y-3">
        <Design.Card space border>
          <JobOfferField
            title="Tryb pracy"
            :value="formatWorkMode(props.jobOffer.workMode)"
            icon="jobOfferWorkModeRemote"/>
          <JobOfferField
            title="Lokalizacja"
            :value="props.jobOffer.locations.join(', ')"
            v-if="props.jobOffer.locations.length"
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
          <Design.Button :primary="!props.preview" :primary-outline="props.preview" full-width>
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
import {Currency, LegalForm, Rate, WorkExperience, WorkMode} from "../../../main";
import {Design} from "../design/design";
import JobOfferField from "../design/JobOffer/JobOfferField.vue";
import {SalaryJobOffer} from "../design/JobOffer/JobOfferSalary.vue";
import JobOfferTagList from "../design/JobOffer/JobOfferTagList.vue";
import {
  formatCompanySizeLevel,
  formatExpiresInDays,
  formatLegalForm,
  formatWorkExperience,
  formatWorkMode,
} from "../format";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOffer: JobOfferShow;
  preview?: boolean;
}

export interface JobOfferShow {
  title: string;
  description: string|null;
  expiresInDays: number;
  locations: string[];
  tagNames: string[];
  workMode: WorkMode;
  legalForm: LegalForm;
  experience: WorkExperience;
  salaryRangeFrom: number|null;
  salaryRangeTo: number|null;
  salaryIsNet: boolean;
  salaryCurrency: Currency;
  salaryRate: Rate;
  companyName: string;
  companyLogoUrl: string|null;
  companyWebsiteUrl: string|null,
  companyDescription: string|null,
  companyFundingYear: number|null,
  companySizeLevel: number|null,
}

interface Emit {
  (event: 'edit'): void;
}

function editJob(): void {
  emit('edit');
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
    !!props.jobOffer.companySizeLevel;
});
</script>
