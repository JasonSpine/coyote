<template>
  <p>Znajdź najlepszych programistów szybciej i skuteczniej!</p>
  <p>4programmers każdego miesiąca odwiedza ponad 150 000+ programistów.</p>
  <Design.Button primary @click="emit('select', 'free',null, 'free')">
    Publikuj ogłoszenie
  </Design.Button>
  <Design.Button primary @click="emit('select', 'paid',null, 'premium')">
    Kup ogłoszenie
  </Design.Button>
  <Design.Button primary @click="emit('select', 'paid','strategic','strategic')">
    Kup pakiet Strategic
  </Design.Button>
  <Design.Button primary @click="emit('select', 'paid','growth','growth')">
    Kup pakiet Growth
  </Design.Button>
  <Design.Button primary @click="emit('select', 'paid','growth','scale')">
    Kup pakiet Scale
  </Design.Button>
</template>

<script setup lang="ts">
import {PlanBundleName, PricingPlan} from "../../../main";
import {Design} from "../design/design";

const emit = defineEmits<Emit>();

interface Emit {
  (event: 'select', plan: 'free'|'paid', bundle: PlanBundleName|null, pricingPlan: PricingPlan): void;
}
</script>
