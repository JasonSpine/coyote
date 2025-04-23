<template>
  <Design.Stepper
    v-model="step"
    :steps="[
        {title:'Informacje o firmie', value:'company'},
        {title:'Kreator oferty pracy', value:'jobOffer'},
        {title:'Podgląd oferty', value:'preview'},
        {title:'Publikacja ogłoszenia', value:'publish'},
      ]"/>
  <Design.Card space title="O firmie">
    <Design.Row>
      <div>
        <Design.FieldLabel title="Logo firmy"/>
        <Design.ImageUpload v-model="jobOffer.companyLogoUrl" :upload="props.upload"/>
        Format: JPEG, PNG. Max size 5MB
      </div>
      <Design.FieldGroup label="Nazwa firmy">
        <Design.TextField
          placeholder="Podaj nazwę firmy dla której chcesz dodać ogłoszenie"
          v-model="jobOffer.companyName"/>
      </Design.FieldGroup>
    </Design.Row>
  </Design.Card>
  <Design.Card space title="Podstawowe informacje">
    <Design.FieldGroup label="Tytuł ogłoszenia">
      <Design.TextField placeholder="np. Senior Java Developer" v-model="jobOffer.title"/>
    </Design.FieldGroup>
    <Design.FieldGroup label="Staż pracy">
      <Design.Dropdown
        icon="jobOfferFilterWorkExperience"
        :options="workExperienceOptions"
        v-model="jobOffer.experience"/>
    </Design.FieldGroup>
  </Design.Card>
  <Design.Card space title="Technologie">
    <Design.FieldGroup label="Wymagane technologie">
      <Design.TextField placeholder="Np. java, python, kotlin, c#, etc." v-model="jobOffer.tagNames[0]"/>
    </Design.FieldGroup>
  </Design.Card>
  <Design.Card space title="Forma zatrudnienia i wynagrodzenie">
    <Design.Row>
      <Design.FieldGroup label="Rodzaj umowy">
        <Design.Dropdown icon="jobOfferFilterLegalForm" :options="legalFormOptions" v-model="jobOffer.legalForm"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Wynagrodzenie od (netto)">
        <Design.Dropdown
          icon="jobOfferFilterCurrency"
          :options="salaryRangeOptions"
          v-model="jobOffer.salaryRangeFrom"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Wynagrodzenie do (netto)">
        <Design.Dropdown icon="jobOfferFilterCurrency" :options="salaryRangeOptions" v-model="jobOffer.salaryRangeTo"/>
      </Design.FieldGroup>
      <Design.FieldGroup label="Waluta">
        <Design.Dropdown
          icon="jobOfferFilterCurrency"
          :options="salaryCurrencyOptions"
          v-model="jobOffer.salaryCurrency"/>
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
      <Design.TextField placeholder="np. Warszawa, al. Jerozolimskie 3" v-model="jobOffer.locations[0]"/>
    </Design.FieldGroup>
  </Design.Card>
  <Design.Card space title="Opis ogłoszenia">
    <Design.FieldGroup label="Szczegółowe informacje">
      <Design.TextField placeholder="Miejsce na szczegółowy opis oferty" v-model="jobOffer.description"/>
    </Design.FieldGroup>
  </Design.Card>
  <Design.Tile space shadow class="sticky bottom-0 mt-3">
    <Design.Row>
      <Design.RowEnd>
        <span @click="emit('abort')" class="mr-8 cursor-pointer">
          Porzuć formularz
        </span>
        <Design.Button primary @click="emit('submit', jobOffer)">
          {{buttonTitle}}
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
  </Design.Tile>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue';
import {Currency, LegalForm, Rate, SubmitJobOffer, UploadImage, WorkExperience, WorkMode} from "../../../main";
import {Design} from "../design/design";
import {DrawerOption} from "../design/Dropdown.vue";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOffer: SubmitJobOffer;
  mode: 'create'|'update';
  upload: UploadImage;
}

interface Emit {
  (event: 'change', jobOffer: SubmitJobOffer): void;
  (event: 'submit', jobOffer: SubmitJobOffer): void;
  (event: 'abort'): void;
}

const jobOffer: SubmitJobOffer = reactive<SubmitJobOffer>({...props.jobOffer});
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
const salaryRangeOptions: DrawerOption<number>[] = range(11).map(i => {
  const value = i * 5000;
  return {value, title: value.toString()};
});
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

function range(items: number): number[] {
  return [...Array(items).keys()];
}

const step = ref<string>('company');
</script>
