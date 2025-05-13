<template>
  <JobOfferStepper four-steps step="publish"/>
  <Design.Card title="Wykorzystaj swój pakiet">
    Pozostało {{props.planBundle.remainingJobOffers}} ogłoszeń dostępnych w pakiecie
    {{capitalize(props.planBundle.bundleName)}}.
  </Design.Card>
  <Design.Tile>
    <Design.Row>
      <Design.RowEnd>
        <Design.Button primary @click="redeemBundle">
          Publikuj korzystając z pakietu
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
  </Design.Tile>
</template>

<script setup lang="ts">
import {Design} from "../design/design";
import JobOfferStepper from './JobOfferStepper.vue';
import {PlanBundle} from "../ui";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOfferId: number;
  planBundle: PlanBundle;
}

interface Emit {
  (event: 'redeem-bundle', jobOfferId: number): void;
}

function redeemBundle(): void {
  emit('redeem-bundle', props.jobOfferId);
}

function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
</script>
