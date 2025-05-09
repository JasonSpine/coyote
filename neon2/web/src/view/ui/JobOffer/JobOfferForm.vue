<template>
  <JobOfferStepper :four-steps="props.fourSteps" :step="step"/>
  <div class="max-w-170 space-y-4 mx-auto" v-if="step === 'company'">
    <Design.Card space title="O firmie">
      <Design.FieldLabel title="Logo firmy"/>
      <Design.Row>
        <div class="mr-8">
          <Design.ImageUpload v-model="jobOffer.companyLogoUrl" :upload="props.upload.uploadLogo"/>
          <Design.FieldHelp>Format: JPEG, PNG. Maksymalny rozmiar 5MB</Design.FieldHelp>
        </div>
        <div class="flex-grow-1 space-y-6">
          <div class="mb-8">
            <Design.RadioGroup vertical :options="hiringTypeOptions" v-model="jobOffer.companyHiringType"/>
          </div>
          <Design.FieldGroup required label="Nazwa firmy" :error="errors.companyName">
            <Design.TextField placeholder="Wpisz nazwę firmy" v-model="jobOffer.companyName"/>
            <Design.FieldHelp>
              Podając nazwę firmy, oferta staje się bardziej wiarygodna i wartościowa.
            </Design.FieldHelp>
          </Design.FieldGroup>
          <Design.FieldGroup label="Strona WWW" :error="errors.companyWebsiteUrl">
            <Design.TextField placeholder="Podaj stronę www firmy" v-model="jobOffer.companyWebsiteUrl"/>
            <Design.FieldHelp>
              Firmowa strona WWW. Będzie wyświetlana przy ofercie.
            </Design.FieldHelp>
          </Design.FieldGroup>
        </div>
      </Design.Row>
    </Design.Card>
    <Design.Card space title="Lokalizacja firmy">
      <Design.FieldGroup label="Adres siedziby firmy">
        <Design.TextField placeholder="np. Warszawa, al. Jerozolimskie 3" v-model="jobOffer.companyAddress"/>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Dodatkowe informacje">
      <Design.FieldGroup label="Rok powstania firmy" :error="errors.companyFundingYear">
        <Design.TextField placeholder="Podaj rok powstania firmy" v-model="jobOffer.companyFundingYear"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Liczba pracowników">
        <Design.Dropdown
          default="Podaj liczbę pracowników firmy"
          :options="companySizeOptions"
          v-model="jobOffer.companySizeLevel"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Opis firmy">
        <Design.TextField
          format-html
          placeholder="Miejsce na szczegółowy opis firmy. Pole nie jest wymagane."
          v-model="jobOffer.companyDescription"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Nagranie wideo">
        <Design.TextField
          placeholder="Podaj link do filmu o firmie w serwisie YouTube"
          v-model="jobOffer.companyVideoUrl"/>
        <Design.FieldHelp>
          Film promujący firmę będzie wyświetlany pod ogłoszeniem o pracę.
        </Design.FieldHelp>
      </Design.FieldGroup>
      <Design.FieldGroup label="Dodaj zdjęcia firmowe">
        <div class="flex space-x-2">
          <JobOfferPhotoSet v-model="jobOffer.companyPhotoUrls" :upload="props.upload.uploadAsset"/>
        </div>
        <Design.FieldHelp>Format: JPEG, PNG. Maksymalny rozmiar 5MB</Design.FieldHelp>
      </Design.FieldGroup>
    </Design.Card>
  </div>
  <div class="max-w-170 space-y-4 mx-auto" v-if="step === 'jobOffer'">
    <Design.Card space title="Podstawowe informacje">
      <Design.FieldGroup required label="Tytuł ogłoszenia" :error="errors.title">
        <Design.TextField placeholder="np. Senior Java Developer" v-model="jobOffer.title"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Staż pracy">
        <Design.Dropdown :options="workExperienceOptions" v-model="jobOffer.experience"/>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Technologie">
      <Design.FieldGroup label="Wymagane technologie">
        <Design.TextField placeholder="Np. java, python, kotlin, c#, etc." v-model="jobOffer.tagNames"/>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Forma zatrudnienia i wynagrodzenie">
      <Design.Row space>
        <Design.FieldGroup label="Rodzaj umowy">
          <Design.Dropdown :options="legalFormOptions" v-model="jobOffer.legalForm"/>
        </Design.FieldGroup>
        <Design.FieldGroup label="Waluta wynagrodzenia">
          <Design.Dropdown :options="salaryCurrencyOptions" v-model="jobOffer.salaryCurrency"/>
        </Design.FieldGroup>
      </Design.Row>
      <Design.Row space>
        <Design.FieldGroup label="Wynagrodzenie od (netto)" :error="errors.salaryRangeFrom">
          <Design.TextField placeholder="Dolne widełki" v-model="jobOffer.salaryRangeFrom"/>
        </Design.FieldGroup>
        <Design.FieldGroup label="Wynagrodzenie do (netto)" :error="errors.salaryRangeTo">
          <Design.TextField placeholder="Górne widełki" v-model="jobOffer.salaryRangeTo"/>
        </Design.FieldGroup>
      </Design.Row>
      <Design.FieldGroup label="Częstotliwość wynagrodzenia">
        <Design.Dropdown :options="salaryRateOptions" v-model="jobOffer.salaryRate"/>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Tryb pracy">
      <Design.RadioGroup :options="workModeOptions" v-model="jobOffer.workMode"/>
    </Design.Card>
    <Design.Card space title="Lokalizacja">
      <JobOfferLocationSet v-model="jobOffer.locations"/>
    </Design.Card>
    <Design.Card space title="Opis ogłoszenia">
      <Design.FieldGroup label="Szczegółowe informacje">
        <Design.TextField
          format-html
          placeholder="Miejsce na szczegółowy opis oferty"
          test-id="jobOfferDescription"
          v-model="jobOffer.description"/>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Sposób aplikacji">
      <Design.FieldLabel title="Jak kandydat powinien aplikować na tę ofertę?"/>
      <div class="mt-6 space-y-8">
        <div>
          <Design.RadioButton
            title="Poprzez 4programmers"
            :selected="jobOffer.applicationMode==='4programmers'"
            @select="jobOffer.applicationMode='4programmers'"/>
          <Design.FieldHelp class="mb-4">
            Zezwól na wysyłanie CV poprzez 4programmers na Twój adres email. Adres e-mail nie
            będzie widoczny dla osób postronnych.
          </Design.FieldHelp>
          <Design.FieldGroup label="E-mail"
                             :error="errors.applicationEmail"
                             :disabled="jobOffer.applicationMode==='external-ats'">
            <Design.TextField placeholder="kontakt@twoja.firma.com" v-model="jobOffer.applicationEmail"/>
          </Design.FieldGroup>
        </div>
        <div>
          <Design.RadioButton
            title="Poprzez Twój system ATS"
            :selected="jobOffer.applicationMode==='external-ats'"
            @select="jobOffer.applicationMode='external-ats'"/>
          <Design.FieldHelp class="mb-4">
            Kandydaci zostaną przekierowani na wskazaną przez Ciebie stronę.
          </Design.FieldHelp>
          <Design.FieldGroup label="Twój adres"
                             :error="errors.applicationExternalAts"
                             :disabled="jobOffer.applicationMode==='4programmers'">
            <Design.TextField
              placeholder="Podaj adres formularza"
              v-model="jobOffer.applicationExternalAts"/>
          </Design.FieldGroup>
        </div>
      </div>
    </Design.Card>
  </div>
  <template v-if="step === 'preview'">
    <JobOfferShow
      preview
      @edit="previousStep"
      :job-offer="fromSubmitToJobOfferShow(fromFormModel(jobOffer), props.jobOfferExpiresInDays)"/>
  </template>
  <div class="sticky bottom-2 mt-5">
    <Design.Tile space shadow>
      <Design.Row vertical-center>
        <span @click="emit('abort')" class="mr-8 cursor-pointer">
          Porzuć formularz
        </span>
        <div class="ml-auto flex items-center">
          <Design.Button outline icon="jobOfferCreatorStepBack" @click="previousStep" v-if="hasPreviousStep">
            Wróć
          </Design.Button>
          <div class="ml-2">
            <Design.Button primary @click="emit('submit', fromFormModel(jobOffer))" v-if="step === 'preview'">
              {{buttonTitle}}
            </Design.Button>
            <Design.Button primary @click="nextStep" v-else>
              Dalej
            </Design.Button>
          </div>
        </div>
      </Design.Row>
    </Design.Tile>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue';
import {BackendJobOfferLocation} from "../../../backend";
import {
  ApplicationMode,
  Currency,
  HiringType,
  LegalForm,
  Rate,
  SubmitJobOffer,
  UploadAssets,
  WorkExperience,
  WorkMode,
} from "../../../main";
import {Design} from "../design/design";
import {DrawerOption} from "../design/Dropdown.vue";
import JobOfferStepper, {JobOfferCreatorStep} from "../design/JobOffer/JobOfferStepper.vue";
import {
  formatCompanySizeLevel,
  formatHiringType,
  formatLegalForm,
  formatWorkExperience,
  formatWorkMode,
} from "../format";
import {JobOfferFormValidation} from './JobOfferFormValidation';
import JobOfferLocationSet from './JobOfferLocationSet.vue';
import JobOfferPhotoSet from './JobOfferPhotoSet.vue';
import {fromSubmitToJobOfferShow} from "./JobOfferShow";
import JobOfferShow from "./JobOfferShow.vue";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOffer: SubmitJobOffer;
  jobOfferExpiresInDays: number;
  mode: 'create'|'update';
  upload: UploadAssets;
  fourSteps: boolean;
}

interface Emit {
  (event: 'change', jobOffer: SubmitJobOffer): void;
  (event: 'submit', jobOffer: SubmitJobOffer): void;
  (event: 'abort'): void;
}

const step = ref<JobOfferCreatorStep>('company');

const jobOffer: FormModel = reactive<FormModel>(toFormModel(props.jobOffer));

const validation = new JobOfferFormValidation(jobOffer, [
  'title', 'companyName', 'applicationEmail', 'applicationExternalAts',
  'salaryRangeFrom', 'salaryRangeTo', 'companyFundingYear',
  'companyWebsiteUrl',
]);

const errors = reactive(validation.emptyErrors());

function nextStep(): void {
  if (step.value === 'preview') {
    throw new Error('Unexpected step.');
  }
  const [success, failureErrors] = validate();
  Object.assign(errors, failureErrors);
  if (success) {
    changeStep(step.value === 'company' ? 'jobOffer' : 'preview');
  } else {
    if (failureErrors.companyName) {
      window.scrollTo(0, 0);
    } else if (failureErrors.title) {
      window.scrollTo(0, 0);
    } else if (failureErrors.salaryRangeFrom || failureErrors.salaryRangeTo) {
      window.scrollTo(0, 600);
    } else if (failureErrors.applicationEmail || failureErrors.applicationExternalAts) {
      window.scrollTo(0, 1000);
    }
  }
}

function validate() {
  if (step.value === 'company') {
    return validation.validate(v => {
      v.nonEmpty('companyName', 'Podaj nazwę firmy.');
      v.optionalNumeric('companyFundingYear', 'Podaj poprawny rok założenia firmy.');
      v.optionalJsUrl('companyWebsiteUrl', 'Podaj poprawny URL witryny firmy.');
    });
  }
  return validation.validate(v => {
    v.nonEmpty('title', 'Podaj tytuł ogłoszenia.');
    v.optionalNumeric('salaryRangeFrom', 'Podaj poprawne wynagrodzenie.');
    v.optionalNumeric('salaryRangeTo', 'Podaj poprawne wynagrodzenie.');
    if (jobOffer.applicationMode === '4programmers') {
      v.nonEmpty('applicationEmail', 'Podaj adres e-mail do otrzymania aplikacji.');
    }
    if (jobOffer.applicationMode === 'external-ats') {
      v.nonEmpty('applicationExternalAts', 'Podaj adres Twojego systemu ATS.');
    }
  });
}

const hasPreviousStep = computed<boolean>(() => step.value !== 'company');

function previousStep(): void {
  if (step.value === 'preview') {
    changeStep('jobOffer');
  } else if (step.value === 'jobOffer') {
    changeStep('company');
  }
}

function changeStep(newStep: JobOfferCreatorStep): void {
  step.value = newStep;
  window.scrollTo(0, 0);
}

const buttonTitle = computed<string>(() => {
  if (props.mode === 'update') {
    return 'Zapisz';
  }
  if (props.fourSteps) {
    return 'Dodaj ogłoszenie';
  }
  return 'Publikuj';
});

const workExperienceOptions: DrawerOption<WorkExperience>[] = [
  {value: 'intern', title: formatWorkExperience('intern')},
  {value: 'junior', title: formatWorkExperience('junior')},
  {value: 'mid-level', title: formatWorkExperience('mid-level')},
  {value: 'senior', title: formatWorkExperience('senior')},
  {value: 'lead', title: formatWorkExperience('lead')},
  {value: 'manager', title: formatWorkExperience('manager')},
  {value: 'not-provided', title: formatWorkExperience('not-provided')},
];
const legalFormOptions: DrawerOption<LegalForm>[] = [
  {value: 'employment', title: formatLegalForm('employment')},
  {value: 'of-mandate', title: formatLegalForm('of-mandate')},
  {value: 'specific-task', title: formatLegalForm('specific-task')},
  {value: 'b2b', title: formatLegalForm('b2b')},
];
const workModeOptions: DrawerOption<WorkMode>[] = [
  {value: 'stationary', title: formatWorkMode('stationary')},
  {value: 'fullyRemote', title: formatWorkMode('fullyRemote')},
  {value: 'hybrid', title: formatWorkMode('hybrid')},
];
const hiringTypeOptions: DrawerOption<HiringType>[] = [
  {value: 'direct', title: formatHiringType('direct')},
  {value: 'agency', title: formatHiringType('agency')},
];
const salaryCurrencyOptions: DrawerOption<Currency>[] = [
  {value: 'PLN', title: 'PLN'},
  {value: 'EUR', title: 'EUR'},
  {value: 'USD', title: 'USD'},
  {value: 'GBP', title: 'GBP'},
  {value: 'CHF', title: 'CHF'},
];
const salaryRateOptions: DrawerOption<Rate>[] = [
  {value: 'hourly', title: 'godzinowo'},
  {value: 'weekly', title: 'tygodniowo'},
  {value: 'monthly', title: 'miesięcznie'},
  {value: 'yearly', title: 'rocznie'},
];
const companySizeOptions: DrawerOption<number|null>[] = [
  {value: null, title: formatCompanySizeLevel(null)},
  {value: 1, title: formatCompanySizeLevel(1)},
  {value: 2, title: formatCompanySizeLevel(2)},
  {value: 3, title: formatCompanySizeLevel(3)},
  {value: 4, title: formatCompanySizeLevel(4)},
  {value: 5, title: formatCompanySizeLevel(5)},
  {value: 6, title: formatCompanySizeLevel(6)},
  {value: 7, title: formatCompanySizeLevel(7)},
  {value: 8, title: formatCompanySizeLevel(8)},
  {value: 9, title: formatCompanySizeLevel(9)},
  {value: 10, title: formatCompanySizeLevel(10)},
  {value: 11, title: formatCompanySizeLevel(11)},
];

interface FormModel {
  title: string;
  description: string;
  salaryRangeFrom: string;
  salaryRangeTo: string;
  salaryCurrency: Currency;
  salaryRate: Rate;
  locations: string[];
  tagNames: string;
  workMode: WorkMode;
  legalForm: LegalForm;
  experience: WorkExperience;
  applicationMode: ApplicationMode;
  applicationEmail: string;
  applicationExternalAts: string;
  companyName: string;
  companyLogoUrl: string|null;
  companyWebsiteUrl: string;
  companyDescription: string;
  companyPhotoUrls: string[];
  companyVideoUrl: string;
  companySizeLevel: number|null;
  companyFundingYear: string;
  companyAddress: string;
  companyHiringType: HiringType;
}

function toFormModel(jobOffer: SubmitJobOffer): FormModel {
  return {
    ...jobOffer,
    salaryRangeFrom: formatNumber(jobOffer.salaryRangeFrom),
    salaryRangeTo: formatNumber(jobOffer.salaryRangeFrom),
    locations: jobOffer.locations.map(location => location.city).filter(city => city !== null),
    tagNames: jobOffer.tagNames.join(', '),
    description: jobOffer.description || '',
    applicationEmail: jobOffer.applicationEmail || '',
    applicationExternalAts: jobOffer.applicationExternalAts || '',
    companyWebsiteUrl: jobOffer.companyWebsiteUrl || '',
    companyDescription: jobOffer.companyDescription || '',
    companyVideoUrl: jobOffer.companyVideoUrl || '',
    companyAddress: jobOffer.companyAddress?.city || '',
    companyFundingYear: jobOffer.companyFundingYear
      ? jobOffer.companyFundingYear.toString()
      : '',
  };
}

function fromFormModel(formModel: FormModel): SubmitJobOffer {
  return {
    ...formModel,
    salaryRangeFrom: parseNumber(formModel.salaryRangeFrom),
    salaryRangeTo: parseNumber(formModel.salaryRangeTo),
    salaryIsNet: true,
    tagNames: formModel.tagNames.split(',').map(s => s.trim()).filter(t => t.length),
    locations: formModel.locations.filter(l => l.length).map(toSubmitLocation).filter(l => l !== null),
    description: parseString(formModel.description),
    applicationEmail: parseString(formModel.applicationEmail),
    applicationExternalAts: parseString(formModel.applicationExternalAts),
    companyWebsiteUrl: parseString(formModel.companyWebsiteUrl),
    companyDescription: parseString(formModel.companyDescription),
    companyVideoUrl: parseString(formModel.companyVideoUrl),
    companyAddress: toSubmitLocation(formModel.companyAddress),
    companyFundingYear: parseNumber(formModel.companyFundingYear),
  };
}

function toSubmitLocation(city: string): BackendJobOfferLocation|null {
  if (city.trim().length === 0) {
    return null;
  }
  return {
    city,
    countryCode: 'PL',
    latitude: 51,
    longitude: 21,
    postalCode: '31-120',
    streetName: 'Ulicowa',
    streetNumber: '12',
  };
}

function formatNumber(value: number|null): string {
  if (value === null) {
    return '';
  }
  return value.toString(10);
}

function parseNumber(value: string): number|null {
  if (value.trim() === '') {
    return null;
  }
  const number = parseInt(value, 10);
  if (isNaN(number)) {
    throw new Error('Failed to parse number.');
  }
  return number;
}

function parseString(string: string): string|null {
  if (string.length) {
    return string.trim();
  }
  return null;
}
</script>
