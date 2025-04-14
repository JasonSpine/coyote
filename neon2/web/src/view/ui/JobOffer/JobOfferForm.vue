<template>
  <h2>
    Wybrany plan: {{props.plan}}
  </h2>
  <Design.Card title="Podstawowe informacje">
    <label>
      Tytuł oferty
      <Design.TextField placeholder="np. Senior Java Developer" v-model="jobTitle"/>
    </label>
  </Design.Card>
  <Design.Tile>
    <Design.Row>
      <Design.RowEnd>
        <Design.Button primary @click="emit('create', jobTitle, props.type, props.plan)">
          Dodaj
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
  </Design.Tile>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {PricingPlan} from "../../../main";
import {Design} from "../design/design";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  type: 'free'|'paid';
  plan: PricingPlan;
}

interface Emit {
  (event: 'create', title: string, type: 'free'|'paid', plan: PricingPlan): void;
}

const jobTitle = ref<string>('');
</script>
