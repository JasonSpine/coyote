<template>
  <p>Znajdź najlepszych programistów szybciej i skuteczniej!</p>
  <p>4programmers każdego miesiąca odwiedza ponad 150 000+ programistów.</p>
  <Design.Button primary @click="emit('select',  'free')">
    Publikuj ogłoszenie
  </Design.Button>
  <Design.Button primary @click="emit('select',  'premium')">
    Kup ogłoszenie
  </Design.Button>
  <Design.Button primary @click="emit('select', 'strategic')">
    Kup pakiet Strategic
  </Design.Button>
  <Design.Button primary @click="emit('select', 'growth')">
    Kup pakiet Growth
  </Design.Button>
  <Design.Button primary @click="emit('select', 'scale')">
    Kup pakiet Scale
  </Design.Button>
</template>

<script setup lang="ts">
import {PricingPlan} from "../../../main";
import {Design} from "../design/design";

const emit = defineEmits<Emit>();

interface Emit {
  (event: 'select', pricingPlan: PricingPlan): void;
}
</script>
