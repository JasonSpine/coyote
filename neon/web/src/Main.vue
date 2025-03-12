<template>
  <select :data-testid="sortField.testId" v-model="state.sort">
    <option v-for="option in sortField.options" :value="option.value" v-text="option.title"/>
  </select>
  <input data-testid="jobOfferSearchPhrase" v-model="state.searchPhrase">
  <input data-testid="jobOfferMinimumSalary" v-model="state.minimumSalary">
  <input type="checkbox" data-testid="jobOfferWorkMode" v-model="state.workModeRemote">
  Praca zdalna
  <Button test-id="jobOfferSearch" @click="search">
    Szukaj
  </Button>
  <ul>
    <li
      v-for="jobOffer in state.jobOffers"
      :data-testid="jobOffer.testId"
      v-text="jobOffer.title"/>
  </ul>
  <footer>
    <select :data-testid="sortField.testId" v-model="state.sort">
      <option
        v-for="option in sortField.options"
        :value="option.value"
        v-text="option.title"/>
    </select>
    <input data-testid="jobOfferMinimumSalary" v-model="state.minimumSalary">
    <Button @click="search" test-id="jobOfferSearch">
      Pokaż oferty
    </Button>
  </footer>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import Button from "./dom/Button.vue";
import {Filters, OrderBy} from "./filters";

interface BackendJobOffer {
  title: string;
  salaryTo: number;
  publishDate: string;
  workMode: 'remote'|'stationary';
}

interface VueJobOffer {
  title: string;
  testId: string;
}

const initialJobOffers: BackendJobOffer[] = window['jobOffers'];

const state = reactive({
  jobOffers: [] as VueJobOffer[],
  searchPhrase: '',
  minimumSalary: 0,
  workModeRemote: false,
  sort: 'most-recent' as OrderBy,
});

const filters = new Filters();
filters.onUpdate(jobOffers => {
  state.jobOffers = jobOffers.map(jobOffer => ({
    title: jobOffer.title,
    testId: 'jobOfferTitle',
  }));
});

initialJobOffers.forEach(jobOffer => {
  filters.addJobOffer({
    title: jobOffer.title,
    salaryTo: jobOffer.salaryTo,
    publishDate: jobOffer.publishDate,
    workMode: jobOffer.workMode,
  });
});

const sortField = {
  type: 'singleSelect',
  testId: 'jobOfferSort',
  options: [
    {value: 'most-recent', title: 'Najnowsze'},
    {value: 'highest-salary', title: 'Najwyższe wynagrodzenie'},
  ],
};

function search(): void {
  filters.filter(state.searchPhrase);
  filters.filterBySalary(state.minimumSalary);
  filters.filterByWorkModeRemote(state.workModeRemote);
  filters.sort(state.sort);
}
</script>
