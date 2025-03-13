<template>
  <Design.Layout>
    <Design.BannerHeading/>
    <Design.Tile>
      <Design.TextField
        v-model="state.searchPhrase"
        placeholder="Szukaj po tytule, nazwie firmy"
        test-id="jobOfferSearchPhrase">
        <Design.Button test-id="jobOfferSearch" @click="search" icon="jobOfferSearch" primary/>
      </Design.TextField>
      <div>
        <Design.Row class="max-md:hidden">
          <Design.Drawer test-id="jobOfferLocation" icon="jobOfferFilterLocation" title="Lokalizacja">
            <Design.CheckBox
              v-model="state.locations[location]"
              :label="location"
              v-for="location in filters.availableLocations()"/>
          </Design.Drawer>
          <Design.Drawer
            :test-id="workModeField.testId"
            :title="workModeField.title"
            :icon="workModeField.icon">
            <Design.CheckBox
              :label="workModeField.remoteLabel"
              :icon="workModeField.remoteIcon"
              v-model="state.workModeRemote"/>
          </Design.Drawer>
          <Design.Dropdown
            :icon="salaryField.icon"
            :title="salaryField.title"
            :test-id="salaryField.testId"
            :options="salaryField.options"
            v-model="state.minimumSalary"/>
          <Design.RowEnd>
            <Design.Dropdown
              :title="sortField.title"
              :test-id="sortField.testId"
              :icon="sortField.icon"
              :options="sortField.options"
              v-model="state.sort"/>
          </Design.RowEnd>
        </Design.Row>
        <Design.Button
          class="md:hidden w-full"
          icon="jobOfferFilter"
          primary-outline>
          Filtruj oferty
        </Design.Button>
      </div>
    </Design.Tile>
    <ul class="space-y-2">
      <li v-for="jobOffer in state.jobOffers" :data-testid="jobOffer.testId">
        <Design.JobOfferListItem :job-offer="jobOffer"/>
      </li>
    </ul>
    <Design.Tile space>
      <Design.Drawer
        :test-id="workModeField.testId"
        :title="workModeField.title"
        :icon="workModeField.icon">
        <Design.CheckBox
          :label="workModeField.remoteLabel"
          :icon="workModeField.remoteIcon"
          v-model="state.workModeRemote"/>
      </Design.Drawer>
      <Design.Dropdown
        :icon="salaryField.icon"
        :title="salaryField.title"
        :test-id="salaryField.testId"
        :options="salaryField.options"
        v-model="state.minimumSalary"/>
      <Design.Divider/>
      <Design.Dropdown
        :title="sortField.title"
        :test-id="sortField.testId"
        :icon="sortField.icon"
        :options="sortField.options"
        v-model="state.sort"/>
      <Design.Row space>
        <Design.Button @click="clearFilters" test-id="jobOfferClearFilters" outline>
          Wyczyść filtry
        </Design.Button>
        <Design.Button @click="search" test-id="jobOfferSearch" primary class="flex-grow-1">
          Pokaż oferty
        </Design.Button>
      </Design.Row>
    </Design.Tile>
  </Design.Layout>
</template>

<script setup lang="ts">
import {reactive} from "vue";
import {Design} from "./dom/design/design";
import {Filters, OrderBy, WorkMode} from "./filters";

interface BackendJobOffer {
  title: string;
  salaryTo: number;
  publishDate: string;
  workMode: WorkMode;
  locations: string[];
}

export interface VueJobOffer {
  title: string;
  locations: string[];
  workMode: WorkMode,
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
    url: '',
    locations: jobOffer.locations,
    workMode: jobOffer.workMode,
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
  title: 'Sortuj według',
  testId: 'jobOfferSort',
  icon: 'jobOfferFilterSort',
  options: [
    {value: 'most-recent', title: 'Najnowsze'},
    {value: 'highest-salary', title: 'Najwyższe wynagrodzenie'},
  ],
};

const salaryField = {
  title: 'Wynagrodzenie',
  icon: 'jobOfferFilterSalary',
  testId: 'jobOfferMinimumSalary',
  options: filters.availableSalaries().map(salary => salary.toString()),
};

const workModeField = {
  testId: 'jobOfferWorkMode',
  title: 'Typ pracy',
  icon: 'jobOfferFilterWorkMode',
  remoteLabel: 'Praca zdalna',
  remoteIcon: 'jobOfferWorkModeRemote',
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

function clearFilters(): void {
  filters.clearFilters();
  state.searchPhrase = filters.searchPhrase();
}
</script>
