<template>
  <JobOfferButtonPill @click="navigateHome">Wróć do ogłoszeń</JobOfferButtonPill>
  <JobOfferShow
    :job-offer="toJobOfferShow(route.routeJobOffer!)"
    :can-edit="route.routeJobOffer!.canEdit"
    @edit="editJob"
    @apply="applyForJob"/>
</template>

<script setup lang="ts">
import {inject} from "vue";
import {RouteProperties} from "../screen/Screens";
import {UiController} from "../ui";
import JobOfferButtonPill from "./JobOfferButtonPill.vue";
import {toJobOfferShow} from "./JobOfferShow";
import JobOfferShow from "./JobOfferShow.vue";

const screen = inject('screen') as Screen;
const route = defineProps<RouteProperties>();

interface Screen {
  uiController: UiController;
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
</script>
