<template>
  <h2>
    Wybrany plan: {{props.plan}}
  </h2>
  <Design.Card title="Podstawowe informacje">
    <label>
      Tytuł ogłoszenia
      <Design.TextField placeholder="np. Senior Java Developer" v-model="jobOffer.title"/>
    </label>
  </Design.Card>
  <Design.Card title="Opis ogłoszenia">
    <label>
      Opis ogłoszenia
      <Design.TextField placeholder="Miejsce na szczegółowy opis oferty" v-model="jobOffer.description"/>
    </label>
  </Design.Card>
  <Design.Tile>
    <Design.Row>
      <Design.RowEnd>
        <Design.Button primary @click="create">
          Dodaj
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
  </Design.Tile>
</template>

<script setup lang="ts">
import {reactive} from 'vue';
import {CreateJobOffer, PricingPlan} from "../../../main";
import {Design} from "../design/design";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  plan: PricingPlan;
}

interface Emit {
  (event: 'create', plan: PricingPlan, jobOffer: CreateJobOffer): void;
}

function create(): void {
  emit('create', props.plan, jobOffer);
}

const jobOffer: CreateJobOffer = reactive<CreateJobOffer>({
  title: '',
  description: '',
});
</script>
