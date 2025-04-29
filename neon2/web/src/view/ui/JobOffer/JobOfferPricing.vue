<template>
  <p>Znajdź najlepszych programistów szybciej i skuteczniej!</p>
  <p>4programmers każdego miesiąca odwiedza ponad 150 000+ programistów.</p>
  <div class="flex justify-center gap-2">
    <JobOfferPricingTab v-model="pricingTab"/>
  </div>
  <div class="flex gap-4" :class="pricingTab === 'offers' ? 'w-2/3 mx-auto' : ''">
    <JobOfferPricingCard
      v-if="pricingTab === 'offers'"
      v-for="plan in offerPlans"
      :plan="plan.name"
      :title="plan.title"
      :bundle-size="plan.bundleSize"
      :price="plan.price + ' PLN'"
      :expiresIn="plan.expiresIn + ' dni'"
      :button-title="buttonTitle(plan)"
      :content="plan.free ? 'restricted' : 'full'"
      :color="plan.color"
      @select="selectPlan"/>
    <JobOfferPricingCard
      v-else
      v-for="plan in bundlePlans"
      :plan="plan.name"
      :title="plan.title"
      :bundle-size="plan.bundleSize"
      :price="plan.price + ' PLN'"
      :bundlePrice="plan.bundlePrice ? plan.bundlePrice + ' PLN' : undefined"
      :expiresIn="plan.expiresIn + ' dni'"
      :button-title="buttonTitle(plan)"
      :content="plan.bundleDiscount ? 'premium-summary' : 'full'"
      :bundle-discount="plan.bundleDiscount"
      :color="plan.color"
      @select="selectPlan"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {PricingPlan} from "../../../main";
import {Design} from "../design/design";
import JobOfferPricingCard, {JobOfferPricingCardColor} from './JobOfferPricingCard.vue';
import JobOfferPricingTab, {PricingTab} from './JobOfferPricingTab.vue';

const emit = defineEmits<Emit>();

interface Emit {
  (event: 'select', pricingPlan: PricingPlan): void;
}

interface PlanCard {
  name: PricingPlan;
  title: string;
  price: number;
  expiresIn: number;
  bundleSize: number;
  bundlePrice?: number;
  bundleDiscount?: string;
  free?: boolean;
  color: JobOfferPricingCardColor;
}

const pricingTab = ref<PricingTab>('offers');

const offerPlans: PlanCard[] = [
  {name: 'free', title: 'Free*', price: 0, expiresIn: 14, bundleSize: 1, free: true, color: 'gray'},
  {name: 'premium', title: 'Premium', price: 159, expiresIn: 30, bundleSize: 1, color: 'yellow'},
];

const bundlePlans: PlanCard[] = [
  {name: 'premium', title: 'Premium', price: 159, expiresIn: 30, bundleSize: 1, color: 'phantom'},
  {
    name: 'strategic',
    title: 'Strategic',
    price: 119,
    expiresIn: 30,
    bundleSize: 3,
    bundlePrice: 3 * 119,
    bundleDiscount: '25%',
    color: 'blue',
  },
  {
    name: 'growth',
    title: 'Growth',
    price: 99,
    expiresIn: 30,
    bundleSize: 5,
    bundlePrice: 5 * 99,
    bundleDiscount: '38%',
    color: 'violet',
  },
  {
    name: 'scale',
    title: 'Scale',
    price: 79,
    expiresIn: 30,
    bundleSize: 20,
    bundlePrice: 20 * 79,
    bundleDiscount: '50%',
    color: 'green',
  },
];

function buttonTitle(plan: PlanCard): string {
  const titles: Record<PricingPlan, string> = {
    'free': 'Publikuj ogłoszenie',
    'premium': 'Kup ogłoszenie',
    'strategic': 'Kup pakiet Strategic',
    'growth': 'Kup pakiet Growth',
    'scale': 'Kup pakiet Scale',
  };
  return titles[plan.name];
}

function selectPlan(pricingPlan: PricingPlan): void {
  emit('select', pricingPlan);
}
</script>
