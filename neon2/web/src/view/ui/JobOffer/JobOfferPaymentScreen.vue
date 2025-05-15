<template>
  <Design.Toast title="Ogłoszenie zostało zapisane, zostanie opublikowane kiedy zaksięgujemy płatność."/>
  <JobOfferRedeemBundle
    v-if="props.planBundle?.canRedeem"
    :view-listener="props.viewListener"
    :job-offer-id="props.paymentJobOfferId"
    :plan-bundle="props.planBundle"/>
  <JobOfferPaymentForm
    v-else
    :view-listener="props.viewListener"
    :job-offer-id="props.paymentJobOfferId"
    :summary="props.paymentSummary"
    :countries="props.invoiceCountries"
    :vat-id-state="props.paymentVatIdState"
    :payment-processing="props.paymentProcessing"/>
</template>

<script setup lang="ts">
import {Country, PaymentSummary, VatIdState} from "../../../main";
import {Design} from "../design/design";
import {PlanBundle, ViewListener} from "../ui";
import JobOfferPaymentForm from "./JobOfferPaymentForm.vue";
import JobOfferRedeemBundle from "./JobOfferRedeemBundle.vue";

const props = defineProps<Props>();

interface Props {
  viewListener: ViewListener;
  planBundle: PlanBundle|null;
  paymentJobOfferId: number;
  invoiceCountries: Country[];
  paymentSummary: PaymentSummary;
  paymentVatIdState: VatIdState;
  paymentProcessing: boolean;
}
</script>
