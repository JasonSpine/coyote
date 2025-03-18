<template>
  <Design.Layout>
    <Design.BannerHeading/>
    <Design.Row>
      <Design.Tabs selected="allOffers" :tabs="pageTabs" @change="redirectToMyOffers"/>
      <Design.RowEnd>
        <Design.Button icon="add" primary-outline @click="redirectToOfferForm">
          Dodaj ofertę
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
    <Design.Tile vertical>
      <Design.TextField
        v-model="state.searchPhrase"
        placeholder="Szukaj po tytule, nazwie firmy"
        test-id="jobOfferSearchPhrase">
        <Design.Button test-id="jobOfferSearch" @click="search" icon="jobOfferSearch" primary/>
      </Design.TextField>
      <div>
        <Design.Row class="max-md:hidden" vertical-center>
          <Design.Drawer nested test-id="jobOfferTags" icon="jobOfferFilterTechnology" title="Technologie">
            <Design.CheckBox
              v-model="state.tags[tag]"
              :label="tag"
              v-for="tag in filters.availableTags()"/>
          </Design.Drawer>
          <Design.Drawer nested test-id="jobOfferLocation" icon="jobOfferFilterLocation" title="Lokalizacja">
            <Design.CheckBox
              v-model="state.locations[location]"
              :label="location"
              v-for="location in filters.availableLocations()"/>
          </Design.Drawer>
          <Design.Drawer
            nested
            :test-id="workModeField.testId"
            :title="workModeField.title"
            :icon="workModeField.icon">
            <Design.CheckBox :label="workModeField.remoteLabel" :icon="workModeField.remoteIcon" v-model="state.workModeRemote"/>
            <Design.CheckBox :label="workModeField.hybridLabel" :icon="workModeField.hybridIcon" v-model="state.workModeHybrid"/>
          </Design.Drawer>
          <Design.Dropdown
            nested
            :icon="salaryField.icon"
            :title="salaryField.title"
            :test-id="salaryField.testId"
            :options="salaryField.options"
            v-model="state.minimumSalary"/>
          <Design.RowEnd>
            <span @click="clearFilters" class="cursor-pointer">
              Wyczyść filtry
            </span>
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
    <Design.DropdownLabel label="Sortowanie:">
      <Design.Dropdown
        :title="sortField.title"
        :test-id="sortField.testId"
        :icon="sortField.icon"
        :options="sortField.options"
        v-model="state.sort"/>
    </Design.DropdownLabel>
    <ul class="space-y-2">
      <li v-for="jobOffer in state.jobOffers" :data-testid="jobOffer.testId">
        <Design.JobOfferListItem :job-offer="jobOffer"/>
      </li>
    </ul>
    <Design.Tile vertical space class="mt-32 w-1/2 h-128 flex flex-col">
      <Design.Drawer
        nested
        :test-id="workModeField.testId"
        :title="workModeField.title"
        :icon="workModeField.icon">
        <Design.CheckBox :label="workModeField.remoteLabel" :icon="workModeField.remoteIcon" v-model="state.workModeRemote"/>
        <Design.CheckBox :label="workModeField.hybridLabel" :icon="workModeField.hybridIcon" v-model="state.workModeHybrid"/>
      </Design.Drawer>
      <Design.Dropdown
        nested
        :icon="salaryField.icon"
        :title="salaryField.title"
        :test-id="salaryField.testId"
        :options="salaryField.options"
        v-model="state.minimumSalary"/>
      <Design.Divider/>
      <Design.Dropdown
        nested
        :test-id="sortField.testId"
        :icon="sortField.icon"
        :options="sortField.options"
        v-model="state.sort"/>
      <Design.Row space class="mt-auto">
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
  url: string;
  salaryFrom: number|null;
  salaryTo: number|null;
  publishDate: string;
  workMode: WorkMode;
  locations: string[];
  companyName: string|null;
  tagNames: string[];
}

export interface VueJobOffer {
  title: string;
  locations: string[];
  workMode: WorkMode;
  url: string;
  companyName: string|null;
  salary: VueSalary|null;
  tagNames: string[];
}

export interface VueSalary {
  to: number;
  from: number;
}

const initialJobOffers: BackendJobOffer[] = window['jobOffers'];

const state = reactive({
  jobOffers: [] as VueJobOffer[],
  searchPhrase: '',
  minimumSalary: 0,
  workModeRemote: false,
  workModeHybrid: false,
  sort: 'most-recent' as OrderBy,
  locations: {},
  tags: {},
});

const filters = new Filters();
filters.onUpdate(jobOffers => {
  state.jobOffers = jobOffers.map(jobOffer => ({
    title: jobOffer.title,
    url: jobOffer.url,
    locations: jobOffer.locations,
    workMode: jobOffer.workMode,
    companyName: jobOffer.companyName,
    salary: salary(jobOffer),
    tagNames: jobOffer.tagNames,
  }));
});

function salary(jobOffer: JobOffer): VueSalary|null {
  if (jobOffer.salaryFrom && jobOffer.salaryTo) {
    return {
      from: jobOffer.salaryFrom!,
      to: jobOffer.salaryTo!,
    };
  }
  return null;
}

initialJobOffers.forEach((jobOffer: BackendJobOffer): void => {
  filters.addJobOffer({
    title: jobOffer.title,
    url: jobOffer.url,
    salaryTo: jobOffer.salaryTo,
    salaryFrom: jobOffer.salaryFrom,
    publishDate: jobOffer.publishDate,
    workMode: jobOffer.workMode,
    locations: jobOffer.locations,
    companyName: jobOffer.companyName,
    tagNames: jobOffer.tagNames,
  });
});

const pageTabs = [
  {value: 'allOffers', title: 'Ogłoszenia'},
  {value: 'myOffers', title: 'Moje ogłoszenia'},
];

const sortField = {
  testId: 'jobOfferSort',
  icon: 'jobOfferFilterSort',
  options: [
    {value: 'most-recent', title: 'Najnowsze'},
    {value: 'highest-salary', title: 'Najwyższe wynagrodzenie'},
    {value: 'lowest-salary', title: 'Najniższe wynagrodzenie'},
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
  hybridLabel: 'Praca hybrydowa',
  hybridIcon: 'jobOfferWorkModeHybrid',
};

function search(): void {
  filters.filter(state.searchPhrase);
  filters.filterBySalary(state.minimumSalary);
  filters.filterByWorkModeRemote(state.workModeRemote);
  filters.filterByWorkModeHybrid(state.workModeHybrid);
  filters.filterByLocation(selected(state.locations));
  filters.filterByTags(selected(state.tags));
  filters.sort(state.sort);
}

function selected<V>(checkboxList: Record<string, boolean>): string[] {
  return Object.entries(checkboxList).filter(([item, selected]) => selected).map(([item, selected]) => item);
}

function clearFilters(): void {
  filters.clearFilters();
  state.searchPhrase = filters.searchPhrase();
}

function redirectToMyOffers(): void {
  window.location.href = '/Praca/Moje';
}

function redirectToOfferForm(): void {
  window.location.href = '/Praca/Oferta';
}
</script>
