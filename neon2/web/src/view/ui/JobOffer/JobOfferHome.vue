<template>
  <div class="text-neutral-600 dark:text-neutral-300 space-y-3">
    <Design.Row>
      <Design.Tabs :tabs="tabs" model-value="jobBoardHome" @update:model-value="changeTab"/>
      <Design.RowEnd class="max-md:hidden">
        <Design.Button icon="add" primary-outline @click="emit('add')">
          Dodaj ogłoszenie
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
    <Design.JobOfferFilters
      :filters="props.filters"
      @filter="filter => emit('filter', filter)"/>
    <Design.JobOfferListItem
      v-for="jobOffer in props.jobOffers"
      :key="jobOffer.id"
      :job-offer="jobOffer"
      @select="emit('show', jobOffer.id)"
      @favourite-change=""/>
    <Design.Material v-if="props.jobOffers.length === 0" nested class="text-center my-2 py-6">
      Nie znaleźliśmy żadnych ofert, pasujących do Twoich kryteriów wyszukiwania.
    </Design.Material>
  </div>
</template>

<script setup lang="ts">
import {JobOffer} from '../../../jobBoard';
import {JobOfferFilter} from "../../../jobOfferFilter";
import {JobOfferFilters} from "../../../main";
import {Design} from "../design/design";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOffers: JobOffer[];
  filters: JobOfferFilters;
}

interface Emit {
  (event: 'show', id: number): void;
  (event: 'add'): void;
  (event: 'filter', filter: JobOfferFilter): void;
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
