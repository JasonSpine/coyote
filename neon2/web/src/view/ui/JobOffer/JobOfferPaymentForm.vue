<template>
  <p>Oferta została stworzona, zostanie opublikowana kiedy zaksięgujemy płatność.</p>
  <template v-if="requiresPayment">
    <Design.Card title="Płatność poprzez bezpieczne połączenie">
      Numer karty
      <div id="creditCardInput"/>
    </Design.Card>
    <Design.Tile>
      <Design.Row>
        <Design.RowEnd>
          <Design.Button primary @click="pay">
            Zapłać i Publikuj
          </Design.Button>
        </Design.RowEnd>
      </Design.Row>
    </Design.Tile>
  </template>
  <template v-else>
    <Design.Card title="Wykorzystaj swój pakiet">
      {{props.planBundle}}
    </Design.Card>
    <Design.Tile>
      <Design.Row>
        <Design.RowEnd>
          <Design.Button primary @click="useBundle">
            Skorzystaj z pakietu by Opublikować
          </Design.Button>
        </Design.RowEnd>
      </Design.Row>
    </Design.Tile>
  </template>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted} from "vue";
import {Design} from "../design/design";
import {PlanBundle} from "../ui";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOfferId: number;
  planBundle: PlanBundle|null;
}

interface Emit {
  (event: 'pay', jobOfferId: number): void;
  (event: 'use-bundle', jobOfferId: number): void;
  (event: 'mountCardInput', cssSelector: string): void;
  (event: 'unmountCardInput'): void;
}

function pay(): void {
  emit('pay', props.jobOfferId);
}

function useBundle(): void {
  emit('use-bundle', props.jobOfferId);
}

onMounted(() => emit('mountCardInput', '#creditCardInput'));
onBeforeUnmount(() => emit('unmountCardInput'));

const requiresPayment = computed<boolean>(() => props.planBundle === null);
</script>
