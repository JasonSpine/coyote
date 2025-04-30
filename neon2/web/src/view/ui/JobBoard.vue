<template>
  <Design.Layout class="bg-body">
    <Design.BannerHeading :back="showHomeLink" @back="navigateHome"/>
    <Design.Toast v-if="toastTitle" :title="toastTitle"/>
    <Design.Toast v-if="planBundleToast"
                  :title="planBundleToast"
                  test-id="planBundle"/>
    <Design.Toast test-id="paymentNotification"
                  :test-value="props.paymentNotification!"
                  v-if="paymentNotificationTitle"
                  :title="paymentNotificationTitle"/>
    <Design.Toast test-id="paymentStatus"
                  v-if="paymentStatusTitle"
                  :title="paymentStatusTitle"/>
    <JobOfferPricing
      v-if="props.screen === 'pricing'"
      @select="selectPlan"/>
    <JobOfferCreate
      v-if="props.screen === 'form'"
      :upload="props.upload!"
      :pricing-plan="props.pricingPlan!"
      :application-email="props.applicationEmail!"
      @create="createJob"
      @abort="navigate('pricing')"/>
    <template v-if="props.screen === 'payment'">
      <Design.Toast title="Ogłoszenie zostało zapisane, zostanie opublikowane kiedy zaksięgujemy płatność."/>
      <JobOfferRedeemBundle
        v-if="props.planBundle?.canRedeem"
        :job-offer-id="props.currentJobOfferId!"
        :plan-bundle="props.planBundle!"
        @redeem-bundle="redeemBundle"/>
      <JobOfferPaymentForm
        v-else
        :job-offer-id="props.currentJobOfferId!"
        :summary="props.paymentSummary!"
        :countries="props.invoiceCountries!"
        @pay="payForJob"
        @mount-card-input="mountCardInput"
        @unmount-card-input="unmountCardInput"
        @vat-details-changed="vatDetailsChanged"/>
    </template>
    <template v-if="props.screen === 'show'">
      <JobOfferButtonPill @click="navigateHome">Wróć do ogłoszeń</JobOfferButtonPill>
      <JobOfferShow :job-offer="currentJobOffer" @edit="editJob"/>
    </template>
    <JobOfferEdit
      v-if="props.screen === 'edit'"
      :id="props.currentJobOfferId!"
      :job-offer="currentJobOffer"
      :job-offer-expires-in-days="currentJobOffer.expiresInDays"
      :upload="props.upload!"
      @update="updateJob"
      @abort="abortEdit"/>
    <JobOfferHome
      v-if="props.screen === 'home'"
      :job-offers="props.jobOffers"
      @show="showJob"
      @add="showJobOfferForm"
      @search="searchJobs"/>
  </Design.Layout>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {JobOffer} from '../../jobBoard';
import {InitiatePayment, PricingPlan, SubmitJobOffer} from "../../main";
import {PaymentNotification} from "../../paymentProvider/PaymentProvider";
import {PaymentStatus} from "../../paymentProvider/PaymentService";
import {Toast} from '../view';
import {Design} from "./design/design";
import JobOfferButtonPill from "./design/JobOffer/JobOfferButtonPill.vue";
import JobOfferCreate from "./JobOffer/JobOfferCreate.vue";
import JobOfferEdit from './JobOffer/JobOfferEdit.vue';
import JobOfferHome from './JobOffer/JobOfferHome.vue';
import JobOfferPaymentForm from './JobOffer/JobOfferPaymentForm.vue';
import JobOfferPricing from './JobOffer/JobOfferPricing.vue';
import JobOfferRedeemBundle from "./JobOffer/JobOfferRedeemBundle.vue";
import JobOfferShow from './JobOffer/JobOfferShow.vue';
import {JobBoardProps, Screen} from "./ui";

const props = defineProps<JobBoardProps>();
const emit = defineEmits<Emit>();

interface Emit {
  (event: 'show-form'): void;
  (event: 'select-plan', plan: PricingPlan): void;
  (event: 'create', plan: PricingPlan, jobOffer: SubmitJobOffer): void;
  (event: 'update', jobOfferId: number, jobOffer: SubmitJobOffer): void;
  (event: 'navigate', screen: Screen, id: number|null): void;
  (event: 'search', searchPhrase: string): void;
  (event: 'pay', payment: InitiatePayment): void;
  (event: 'redeem-bundle', jobOfferId: number): void;
  (event: 'mount-card-input', cssSelector: string): void;
  (event: 'unmount-card-input'): void;
  (event: 'vat-details-changed', countryCode: string, vatId: string): void;
}

function navigate(newScreen: Screen, id?: number): void {
  emit('navigate', newScreen, id || null);
}

const currentJobOffer = computed<JobOffer>(() => {
  return props.jobOffers.find(offer => offer.id === props.currentJobOfferId)!;
});

function createJob(jobOffer: SubmitJobOffer): void {
  emit('create', props.pricingPlan!, jobOffer);
}

function updateJob(id: number, jobOffer: SubmitJobOffer): void {
  emit('update', id, jobOffer);
}

function editJob(): void {
  navigate('edit', props.currentJobOfferId!);
}

function showJob(id: number): void {
  navigate('show', id);
}

function navigateHome(): void {
  navigate('home');
}

function abortEdit(): void {
  showJob(props.currentJobOfferId!);
}

function payForJob(payment: InitiatePayment): void {
  emit('pay', payment);
}

function redeemBundle(jobOfferId: number): void {
  emit('redeem-bundle', jobOfferId);
}

function selectPlan(pricingPlan: PricingPlan): void {
  emit('select-plan', pricingPlan);
  navigate('form');
}

function showJobOfferForm(): void {
  emit('show-form');
}

function searchJobs(searchPhrase: string): void {
  emit('search', searchPhrase);
}

function mountCardInput(cssSelector: string): void {
  emit('mount-card-input', cssSelector);
}

function unmountCardInput(): void {
  emit('unmount-card-input');
}

const showHomeLink = computed<boolean>(() => props.screen !== 'home');

const toastTitle = computed<string|null>(() => {
  if (props.toast === null) {
    return null;
  }
  const titles: Record<Toast, string> = {
    created: 'Dodano ogłoszenie!',
    edited: 'Zaktualizowano ogłoszenie!',
    'bundle-used': 'Skorzystałeś z pakietu, żeby opublikować ogłoszenie!',
  };
  return titles[props.toast];
});

const planBundleToast = computed<string|null>(() => {
  if (props.planBundle === null) {
    return null;
  }
  return `Pozostało ${props.planBundle.remainingJobOffers} ogłoszeń z Pakietu ${capitalize(props.planBundle.bundleName)}.`;
});

function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const paymentStatusTitle = computed<string|null>(() => {
  if (props.paymentStatus === null) {
    return null;
  }
  const titles: Record<PaymentStatus, string> = {
    paymentComplete: 'Płatność zaksięgowana!',
    paymentFailed: 'Płatność odrzucona.',
  };
  return titles[props.paymentStatus];
});

const paymentNotificationTitle = computed<string|null>(() => {
  if (props.paymentNotification === null) {
    return null;
  }
  const titles: Record<PaymentNotification, string> = {
    accepted: 'Przyjęto polecenie płatności.',
    declinedCardExpired: 'Karta płatnicza wygasła. Użyj aktualnej karty i spróbuj ponownie.',
    declinedInsufficientFunds: 'Brak wystarczających środków na koncie. Upewnij się, że masz wystarczającą ilość środków lub użyj innej karty.',
    declinedCard: 'Płatność została odrzucona przez bank. Sprawdź dane karty lub skontaktuj się ze swoim bankiem.',
    declinedPayment: 'Nie udało się przetworzyć płatności. Spróbuj ponownie lub wybierz inną metodę płatności.',
    unexpectedProviderResponse: 'Wystąpił nieoczekiwany błąd po stronie operatora płatności. Spróbuj ponownie za chwilę lub wybierz inną metodę płatności.',
  };
  return titles[props.paymentNotification];
});

function vatDetailsChanged(countryCode: string, vatId: string): void {
  emit('vat-details-changed', countryCode, vatId);
}
</script>
