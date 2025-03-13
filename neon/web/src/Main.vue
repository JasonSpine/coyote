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
          <Design.CheckBox v-model="state.workModeRemote" test-id="jobOfferWorkMode" label="Praca zdalna" icon="jobOfferWorkModeRemote"/>
        </Design.Tile>
        <Design.Tile nested icon="jobOfferFilterSort">
          <select :data-testid="sortField.testId" v-model="state.sort" class="outline-none">
            <option v-for="option in sortField.options" :value="option.value" v-text="option.title"/>
          </select>
        </Design.Tile>
      </Design.Row>
    </Design.Tile>
    <Design.Tile>
      <Design.Row>
        <Design.Tile nested>
          <input data-testid="jobOfferMinimumSalary" v-model="state.minimumSalary">
        </Design.Tile>
        <Design.Tile nested icon="jobOfferFilterSalary">
          <select data-testid="jobOfferMinimumSalarySelect" v-model="state.minimumSalary" class="outline-none">
            <option
              v-for="salary in filters.availableSalaries()"
              :value="salary"
              v-text="salary"/>
          </select>
        </Design.Tile>
      </Design.Row>
    </Design.Tile>
    <Design.Tile test-id="jobOfferLocation">
      <Design.CheckBox
        v-model="state.locations[location]"
        :label="location"
        v-for="location in filters.availableLocations()"/>
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
      <select data-testid="jobOfferMinimumSalarySelect" v-model="state.minimumSalary">
        <option
          v-for="salary in filters.availableSalaries()"
          :value="salary"
          v-text="salary"/>
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
import {Design} from "./dom/design/design";
import {Filters, OrderBy} from "./filters";

interface BackendJobOffer {
  title: string;
  salaryTo: number;
  publishDate: string;
  workMode: 'remote'|'stationary';
  locations: string[];
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
  locations: {},
});

const filters = new Filters();
filters.onUpdate(jobOffers => {
  state.jobOffers = jobOffers.map(jobOffer => ({
    title: jobOffer.title,
    testId: 'jobOfferTitle',
  }));
});

initialJobOffers.forEach((jobOffer: BackendJobOffer): void => {
  filters.addJobOffer({
    title: jobOffer.title,
    salaryTo: jobOffer.salaryTo,
    publishDate: jobOffer.publishDate,
    workMode: jobOffer.workMode,
    locations: jobOffer.locations,
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
  const locations = Object.entries(state.locations)
    .filter(([location, selected]) => selected)
    .map(([location, selected]) => location);
  filters.filterByLocation(locations);
  filters.sort(state.sort);
}
</script>
