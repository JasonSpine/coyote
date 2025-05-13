<template>
  <Design.Layout class="bg-body">
    <Design.BannerHeading
      :pricing="props.screen === 'pricing'"
      :back="showHomeLink"
      @back="navigateHome"/>
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
      :ui-controller="props.uiController"/>
    <JobOfferCreate
      v-if="props.screen === 'form'"
      :ui-controller="props.uiController"
      :view-listener="props.viewListener!"
      :upload="props.upload!"
      :pricing-plan="props.pricingPlan!"
      :application-email="props.applicationEmail!"/>
    <template v-if="props.screen === 'payment'">
      <Design.Toast title="Ogłoszenie zostało zapisane, zostanie opublikowane kiedy zaksięgujemy płatność."/>
      <JobOfferRedeemBundle
        v-if="props.planBundle?.canRedeem"
        :view-listener="props.viewListener!"
        :job-offer-id="props.currentJobOfferId!"
        :plan-bundle="props.planBundle!"/>
      <JobOfferPaymentForm
        v-else
        :view-listener="props.viewListener!"
        :job-offer-id="props.currentJobOfferId!"
        :summary="props.paymentSummary!"
        :countries="props.invoiceCountries!"
        :vat-id-state="props.paymentVatIdState"/>
    </template>
    <JobOfferShowScreen
      v-if="props.screen === 'show'"
      :ui-controller="props.uiController"
      :id="props.currentJobOfferId!"
      :job-offer="toJobOfferShow(currentJobOffer)"/>
    <JobOfferEdit
      v-if="props.screen === 'edit'"
      :ui-controller="props.uiController"
      :view-listener="props.viewListener!"
      :upload="props.upload!"
      :id="props.currentJobOfferId!"
      :job-offer="toSubmitJobOffer(currentJobOffer)"
      :job-offer-expires-in-days="currentJobOffer.expiresInDays"/>
    <JobOfferHome
      v-if="props.screen === 'home'"
      :ui-controller="props.uiController"
      :job-offers="props.jobOffers"
      :filters="props.jobOfferFilters"/>
  </Design.Layout>
</template>

<script setup lang="ts">
import {computed, onMounted, provide, watch} from 'vue';
import {JobOffer} from '../../jobBoard';
import {toSubmitJobOffer} from "../../main";
import {PaymentNotification} from "../../paymentProvider/PaymentProvider";
import {PaymentStatus} from "../../paymentProvider/PaymentService";
import {Toast} from '../view';
import {Design} from "./design/design";
import {JobBoardProperties} from "./JobBoardProperties";
import JobOfferCreate from "./JobOffer/JobOfferCreate.vue";
import JobOfferEdit from './JobOffer/JobOfferEdit.vue';
import JobOfferHome from './JobOffer/JobOfferHome.vue';
import JobOfferPaymentForm from './JobOffer/JobOfferPaymentForm.vue';
import JobOfferPricing from './JobOffer/JobOfferPricing.vue';
import JobOfferRedeemBundle from "./JobOffer/JobOfferRedeemBundle.vue";
import {toJobOfferShow} from "./JobOffer/JobOfferShow";
import JobOfferShowScreen from "./JobOffer/JobOfferShowScreen.vue";
import {Screen} from "./ui";

const props = defineProps<JobBoardProperties>();

function navigate(newScreen: Screen, id?: number): void {
  props.uiController.navigate(newScreen, id || null);
}

provide('locationProvider', props.locationProvider!);

const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
onMounted(() => changeThemeIfApplicable(darkModePreference.matches));
darkModePreference.addEventListener('change', (event) => changeThemeIfApplicable(event.matches));
watch(() => props.screen, () => changeThemeIfApplicable(darkModePreference.matches));

function screenHasDarkTheme(): boolean {
  return ['edit', 'form', 'payment', 'pricing'].indexOf(props.screen) === -1;
}

function changeThemeIfApplicable(darkTheme: boolean): void {
  changeTheme(screenHasDarkTheme() && darkTheme);
}

function changeTheme(darkTheme: boolean): void {
  document.documentElement.dataset.theme = darkTheme ? 'dark' : 'light';
}

const currentJobOffer = computed<JobOffer>(() => {
  return props.jobOffers.find(offer => offer.id === props.currentJobOfferId)!;
});

function navigateHome(): void {
  navigate('home');
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
</script>
