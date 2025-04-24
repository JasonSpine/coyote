<template>
  <JobOfferStepper step="publish"/>
  <Design.Card title="Wszystko gotowe">
    Ogłoszenie zostało zaktualizowane.
  </Design.Card>
  <Design.Tile space>
    <Design.Row>
      <Design.RowEnd>
        <span @click="emit('show-all')" class="mr-8 cursor-pointer">
          Zobacz pozostałe
        </span>
        <Design.Button primary @click="show">
          Zobacz
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
  </Design.Tile>
</template>

<script setup lang="ts">
import {Design} from "../design/design";
import JobOfferStepper from '../design/JobOffer/JobOfferStepper.vue';

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOfferId: number;
}

interface Emit {
  (event: 'show', jobOfferId: number): void;
  (event: 'show-all'): void;
}

function show(): void {
  emit('show', props.jobOfferId);
}
</script>
