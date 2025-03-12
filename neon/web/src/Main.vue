<template>
  <Design.Layout>
    <Design.BannerHeading/>
    <Design.Tile>
      <Design.TextField
        v-model="state.searchPhrase"
        placeholder="Szukaj po tytule, nazwie firmy"
        test-id="jobOfferSearchPhrase">
        <Design.Button test-id="jobOfferSearch" @click="search" icon="jobOfferSearch" primary>
          Szukaj
        </Design.Button>
      </Design.TextField>
      <Design.Row>
        <Design.Tile nested>
          <input data-testid="jobOfferMinimumSalary" v-model="state.minimumSalary">
        </Design.Tile>
        <Design.Tile nested>
          <input type="checkbox" data-testid="jobOfferWorkMode" v-model="state.workModeRemote">
          <Icon name="jobOfferWorkModeRemote"/>
          Praca zdalna
        </Design.Tile>
        <Design.Tile nested icon="jobOfferFilterSort">
          <select :data-testid="sortField.testId" v-model="state.sort" class="outline-none">
            <option v-for="option in sortField.options" :value="option.value" v-text="option.title"/>
          </select>
        </Design.Tile>
      </Design.Row>
    </Design.Tile>
    <ul class="space-y-2">
      <li v-for="jobOffer in state.jobOffers" :data-testid="jobOffer.testId">
        <Design.Tile>
          {{ jobOffer.title }}
        </Design.Tile>
      </li>
    </ul>
    <Design.Tile>
      <select :data-testid="sortField.testId" v-model="state.sort">
        <option
          v-for="option in sortField.options"
          :value="option.value"
          v-text="option.title"/>
      </select>
      <input data-testid="jobOfferMinimumSalary" v-model="state.minimumSalary">
      <Design.Button @click="search" test-id="jobOfferSearch" primary>
        Pokaż oferty
      </Design.Button>
    </Design.Tile>
  </Design.Layout>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import Icon from "./dom/component/Icon.vue";
import {Design} from "./dom/design/design";
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
