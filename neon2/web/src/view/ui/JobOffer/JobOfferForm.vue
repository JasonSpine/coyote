<template>
  <Design.Stepper
    v-model="step"
    :steps="[
        {title:'Informacje o firmie', value:'company'},
        {title:'Kreator oferty pracy', value:'jobOffer'},
        {title:'Podgląd oferty', value:'preview'},
        {title:'Publikacja ogłoszenia', value:'publish'},
      ]"/>
  <div class="max-w-170 space-y-4 mx-auto">
    <Design.Card space title="O firmie">
      <Design.FieldLabel title="Logo firmy"/>
      <Design.Row>
        <div class="mr-8">
          <Design.ImageUpload v-model="jobOffer.companyLogoUrl" :upload="props.upload.uploadLogo"/>
          <Design.FieldHelp>Format: JPEG, PNG. Maksymalny rozmiar 5MB</Design.FieldHelp>
        </div>
        <div class="flex-grow-1">
          <div class="mb-8">
            <Design.RadioGroup vertical :options="hiringTypeOptions" v-model="jobOffer.companyHiringType"/>
          </div>
          <Design.FieldGroup required label="Nazwa firmy">
            <Design.TextField
              placeholder="Wpisz nazwę firmy"
              v-model="jobOffer.companyName"/>
            <Design.FieldHelp>
              Podając nazwę firmy, oferta staje się bardziej wiarygodna i wartościowa.
            </Design.FieldHelp>
          </Design.FieldGroup>
          <Design.FieldGroup label="Strona WWW">
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
      <Design.FieldGroup label="Rok powstania firmy">
        <Design.TextField placeholder="Podaj rok powstania firmy" v-model="jobOffer.companyFundingYear"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Liczba pracowników">
        <Design.Dropdown
          default="Podaj liczbę pracowników firmy"
          :options="companySizeOptions"
          v-model="jobOffer.companySizeLevel"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Opis firmy">
        <Design.TextField placeholder="Miejsce na szczegółowy opis firmy. Pole nie jest wymagane."
                          v-model="jobOffer.companyDescription"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Nagranie wideo">
        <Design.TextField placeholder="Podaj link do filmu o firmie w serwisie YouTube"
                          v-model="jobOffer.companyVideoUrl"/>
        <Design.FieldHelp>
          Film promujący firmę będzie wyświetlany pod ogłoszeniem o pracę.
        </Design.FieldHelp>
      </Design.FieldGroup>
      <Design.FieldGroup label="Dodaj zdjęcie">
        <Design.ImageUpload v-model="jobOffer.companyPhotoUrl" :upload="props.upload.uploadAsset"/>
        <Design.FieldHelp>Format: JPEG, PNG. Maksymalny rozmiar 5MB</Design.FieldHelp>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Podstawowe informacje">
      <Design.FieldGroup required label="Tytuł ogłoszenia">
        <Design.TextField placeholder="np. Senior Java Developer" v-model="jobOffer.title"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Staż pracy">
        <Design.Dropdown icon="jobOfferFilterWorkExperience" :options="workExperienceOptions"
                         v-model="jobOffer.experience"/>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Technologie">
      <Design.FieldGroup label="Wymagane technologie">
        <Design.TextField placeholder="Np. java, python, kotlin, c#, etc." v-model="jobOffer.tagNames"/>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Forma zatrudnienia i wynagrodzenie">
      <Design.Row>
        <Design.FieldGroup label="Rodzaj umowy">
          <Design.Dropdown icon="jobOfferFilterLegalForm" :options="legalFormOptions" v-model="jobOffer.legalForm"/>
        </Design.FieldGroup>
        <Design.FieldGroup label="Waluta wynagrodzenia">
          <Design.Dropdown
            icon="jobOfferFilterCurrency"
            :options="salaryCurrencyOptions"
            v-model="jobOffer.salaryCurrency"/>
        </Design.FieldGroup>
      </Design.Row>
      <Design.Row>
        <Design.FieldGroup label="Wynagrodzenie od (netto)">
          <Design.Dropdown
            icon="jobOfferFilterCurrency"
            :options="salaryRangeOptions"
            v-model="jobOffer.salaryRangeFrom"/>
        </Design.FieldGroup>
        <Design.FieldGroup label="Wynagrodzenie do (netto)">
          <Design.Dropdown
            icon="jobOfferFilterCurrency"
            :options="salaryRangeOptions"
            v-model="jobOffer.salaryRangeTo"/>
        </Design.FieldGroup>
      </Design.Row>
      <Design.FieldGroup label="Częstotliwość wynagrodzenia">
        <Design.Dropdown icon="jobOfferFilterSalary" :options="salaryRateOptions" v-model="jobOffer.salaryRate"/>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Tryb pracy">
      <Design.RadioGroup :options="workModeOptions" v-model="jobOffer.workMode"/>
    </Design.Card>
    <Design.Card space title="Lokalizacja">
      <Design.FieldGroup label="Lokalizacja">
        <Design.TextField placeholder="np. Warszawa, al. Jerozolimskie 3" v-model="jobOffer.locations"/>
      </Design.FieldGroup>
    </Design.Card>
    <Design.Card space title="Opis ogłoszenia">
      <Design.FieldGroup label="Szczegółowe informacje">
        <Design.TextField placeholder="Miejsce na szczegółowy opis oferty" v-model="jobOffer.description"/>
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
          <Design.FieldHelp>
            Zezwól na wysyłanie CV poprzez 4Programmers na Twój adres email. Adres e-mail nie będzie widoczny dla osób
            postronnych.
          </Design.FieldHelp>
          <Design.FieldGroup label="E-mail">
            <Design.TextField placeholder="kontakt@twoja.firma.com" v-model="jobOffer.applicationEmail"/>
          </Design.FieldGroup>
        </div>
        <div>
          <Design.RadioButton
            title="Poprzez Twój system ATS"
            :selected="jobOffer.applicationMode==='external-ats'"
            @select="jobOffer.applicationMode='external-ats'"/>
          <Design.FieldHelp>
            Kandydaci zostaną przekierowani na wskazaną przez Ciebie stronę.
          </Design.FieldHelp>
          <Design.FieldGroup label="Twój adres">
            <Design.TextField placeholder="Podaj adres formularza" v-model="jobOffer.applicationExternalAts"/>
          </Design.FieldGroup>
        </div>
      </div>
    </Design.Card>
  </div>
  <div class="sticky bottom-0 mt-3 max-w-210 mx-auto">
    <Design.Tile space shadow>
      <Design.Row>
        <Design.RowEnd>
          <span @click="emit('abort')" class="mr-8 cursor-pointer">
            Porzuć formularz
          </span>
          <Design.Button primary @click="emit('submit', fromFormModel(jobOffer))">
            {{buttonTitle}}
          </Design.Button>
        </Design.RowEnd>
      </Design.Row>
    </Design.Tile>
  </div>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue';
import {ApplicationMode, Currency, HiringType, LegalForm, Rate, SubmitJobOffer, UploadAssets, WorkExperience, WorkMode} from "../../../main";
import {Design} from "../design/design";
import {DrawerOption} from "../design/Dropdown.vue";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOffer: SubmitJobOffer;
  mode: 'create'|'update';
  upload: UploadAssets;
}

interface Emit {
  (event: 'change', jobOffer: SubmitJobOffer): void;
  (event: 'submit', jobOffer: SubmitJobOffer): void;
  (event: 'abort'): void;
}

const jobOffer: FormModel = reactive<FormModel>(toFormModel(props.jobOffer));
const buttonTitle = computed<string>(() => {
  if (props.mode === 'create') {
    return 'Dodaj';
  }
  return 'Zapisz';
});

const workExperienceOptions: DrawerOption<WorkExperience>[] = [
  {value: 'intern', title: 'Stażysta'},
  {value: 'junior', title: 'Junior'},
  {value: 'mid-level', title: 'Mid/Regular'},
  {value: 'senior', title: 'Senior'},
  {value: 'lead', title: 'Lead'},
  {value: 'manager', title: 'Manager'},
  {value: 'not-provided', title: 'Wybierz...'},
];
const legalFormOptions: DrawerOption<LegalForm>[] = [
  {value: 'employment', title: 'Umowa o pracę'},
  {value: 'of-mandate', title: 'Umowa zlecenie'},
  {value: 'specific-task', title: 'Umowa o dzieło'},
  {value: 'b2b', title: 'B2B'},
];
const workModeOptions: DrawerOption<WorkMode>[] = [
  {value: 'stationary', title: 'Praca stacjonarna'},
  {value: 'fullyRemote', title: 'Praca zdalna 100%'},
  {value: 'hybrid', title: 'Praca hybrydowa'},
];
const hiringTypeOptions: DrawerOption<HiringType>[] = [
  {value: 'direct', title: 'Bezpośredni pracodawca'},
  {value: 'agency', title: 'Agencja pośrednictwa'},
];
const salaryRangeOptions: DrawerOption<number|null>[] = [
  {value: null, title: 'Wybierz...'},
  ...range(11).map(i => {
    const value = i * 5000;
    return {value, title: value.toString()};
  }),
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
  {value: null, title: 'Wybierz...'},
  {value: 1, title: '1-5'},
  {value: 2, title: '6-10'},
  {value: 3, title: '11-20'},
  {value: 4, title: '21-30'},
  {value: 5, title: '31-50'},
  {value: 6, title: '51-100'},
  {value: 7, title: '101-200'},
  {value: 8, title: '201-500'},
  {value: 9, title: '501-1000'},
  {value: 10, title: '1001-5000'},
  {value: 11, title: '5000+'},
];

function range(items: number): number[] {
  return [...Array(items).keys()];
}

const step = ref<string>('company');

interface FormModel {
  title: string;
  description: string;
  salaryRangeFrom: number|null;
  salaryRangeTo: number|null;
  salaryCurrency: Currency;
  salaryRate: Rate;
  locations: string;
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
  companyPhotoUrl: string|null;
  companyVideoUrl: string;
  companySizeLevel: number|null;
  companyFundingYear: string;
  companyAddress: string;
  companyHiringType: HiringType;
}

function toFormModel(jobOffer: SubmitJobOffer): FormModel {
  return {
    ...jobOffer,
    tagNames: jobOffer.tagNames.join(', '),
    locations: jobOffer.locations.join(', '),
    description: jobOffer.description || '',
    applicationEmail: jobOffer.applicationEmail || '',
    applicationExternalAts: jobOffer.applicationExternalAts || '',
    companyWebsiteUrl: jobOffer.companyWebsiteUrl || '',
    companyDescription: jobOffer.companyDescription || '',
    companyVideoUrl: jobOffer.companyVideoUrl || '',
    companyAddress: jobOffer.companyAddress || '',
    companyFundingYear: jobOffer.companyFundingYear
      ? jobOffer.companyFundingYear.toString()
      : '',
  };
}

function fromFormModel(formModel: FormModel): SubmitJobOffer {
  return {
    ...formModel,
    salaryIsNet: true,
    tagNames: jobOffer.tagNames.split(',').map(s => s.trim()).filter(t => t.length),
    locations: jobOffer.locations.split(',').map(s => s.trim()).filter(l => l.length),
    description: parseString(formModel.description),
    applicationEmail: parseString(formModel.applicationEmail),
    applicationExternalAts: parseString(formModel.applicationExternalAts),
    companyWebsiteUrl: parseString(formModel.companyWebsiteUrl),
    companyDescription: parseString(formModel.companyDescription),
    companyVideoUrl: parseString(formModel.companyVideoUrl),
    companyAddress: parseString(formModel.companyAddress),
    companyFundingYear: parseNumber(formModel.companyFundingYear),
  };
}

function parseString(string: string): string|null {
  if (string.length) {
    return string.trim();
  }
  return null;
}

function parseNumber(number: string): number|null {
  if (number.trim().length) {
    return parseInt(number.trim());
  }
  return null;
}
</script>
