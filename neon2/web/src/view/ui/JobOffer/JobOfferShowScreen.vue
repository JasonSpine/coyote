<template>
  <JobOfferButtonPill @click="navigateHome">Wróć do ogłoszeń</JobOfferButtonPill>
  <Design.Card
    title="Ogłoszenie oczekuje na płatność"
    v-if="route.routeJobOffer!.status === 'awaitingPayment'">
    <Design.Button primary @click="resumePayment">
      Przejdź do płatności
    </Design.Button>
  </Design.Card>
  <JobOfferShow
    :job-offer="toJobOfferShow(route.routeJobOffer!)"
    :can-edit="route.routeJobOffer!.canEdit"
    @edit="editJob"
    @apply="applyForJob"/>
</template>

<script setup lang="ts">
import {inject} from "vue";
import {Design} from "../design/design";
import {RouteProperties} from "../screen/Screens";
import {UiController, ViewListener} from "../ui";
import JobOfferButtonPill from "./JobOfferButtonPill.vue";
import {toJobOfferShow} from "./JobOfferShow";
import JobOfferShow from "./JobOfferShow.vue";

const screen = inject('screen') as Screen;
const route = defineProps<RouteProperties>();

interface Screen {
  uiController: UiController;
  viewListener: ViewListener;
}

function navigateHome(): void {
  screen.uiController.navigate('home', null);
}

function editJob(): void {
  screen.uiController.navigate('edit', route.routeJobOffer!.id);
}

function applyForJob(): void {
  screen.uiController.applyForJob(route.routeJobOffer!.id);
}

function resumePayment(): void {
  screen.uiController.navigate('payment', route.routeJobOffer!.id);
}
</script>
