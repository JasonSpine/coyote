<template>
  <div class="text-neutral-600 dark:text-neutral-300 space-y-3">
    <Design.Row>
      <Design.Tabs :tabs="tabs" model-value="jobBoardHome" @update:model-value="changeTab"/>
      <Design.RowEnd class="max-md:hidden">
        <Design.Button icon="add" primary-outline @click="props.uiController.showForm">
          Dodaj ogłoszenie
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
    <JobOfferFilters
      :filters="props.filters"
      @filter="props.uiController.filter"/>
    <JobOfferListItem
      v-for="jobOffer in props.jobOffers"
      :key="jobOffer.id"
      :job-offer="jobOffer"
      @select="props.uiController.showJobOffer(jobOffer)"
      @favourite-change=""/>
    <Design.Material v-if="props.jobOffers.length === 0" nested class="text-center my-2 py-6">
      Nie znaleźliśmy żadnych ofert, pasujących do Twoich kryteriów wyszukiwania.
    </Design.Material>
  </div>
</template>

<script setup lang="ts">
import {JobOffer} from '../../../jobBoard';
import {JobOfferFilters as Filters} from "../../../main";
import {Design} from "../design/design";
import {UiController} from "../ui";
import JobOfferFilters from "./JobOfferFilters.vue";
import JobOfferListItem from "./JobOfferListItem.vue";

const props = defineProps<Props>();

interface Props {
  uiController: UiController;
  jobOffers: JobOffer[];
  filters: Filters;
}

const tabs = [
  {value: 'jobBoardHome', title: 'Ogłoszenia', titleShort: 'Ogłoszenia'},
  {value: 'jobBoardMine', title: 'Moje ogłoszenia', titleShort: 'Moje'},
];

function changeTab(tab: string): void {
  if (tab === 'jobBoardMine') {
    window.location.href = '/Praca/Moje';
  }
}
</script>
