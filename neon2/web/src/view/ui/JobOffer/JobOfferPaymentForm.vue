<template>
  <JobOfferStepper four-steps step="publish"/>
  <div class="max-w-170 space-y-4 mx-auto">
    <Design.Card title="Płatność poprzez bezpieczne połączenie">
      <Design.PaymentMethod :options="paymentMethods" v-model="method"/>
      <Design.FieldGroup required label="Numer karty" v-show="method === 'card'">
        <div id="creditCardInput" class="border border-neutral-100 px-2 py-3 rounded-lg">
          Wczytywanie...
        </div>
      </Design.FieldGroup>
      <Design.Toast :subtitle="paymentP24Information" v-if="method === 'p24'"/>
    </Design.Card>
    <Design.Card title="Dane do faktury">
      <Design.FieldGroup required label="Nazwa firmy" :error="errors.companyName">
        <Design.TextField
          placeholder="Nazwa firmy na którą ma być wystawiona faktura"
          v-model="invoiceInformation.companyName"/>
      </Design.FieldGroup>
      <Design.Row columns>
        <Design.FieldGroup required label="Kraj" :error="errors.countryCode">
          <Design.TextField placeholder="Np. Polska, etc." v-model="invoiceInformation.countryCode"/>
        </Design.FieldGroup>
        <Design.FieldGroup required label="NIP / VAT - ID" :error="errors.vatId">
          <Design.TextField placeholder="Np. 1234123412" v-model="invoiceInformation.vatId"/>
        </Design.FieldGroup>
      </Design.Row>
      <Design.FieldGroup required label="Adres" :error="errors.companyAddress">
        <Design.TextField placeholder="Np. al. Jerozolimskie 3" v-model="invoiceInformation.companyAddress"/>
      </Design.FieldGroup>
      <Design.Row columns>
        <Design.FieldGroup required label="Kod pocztowy" :error="errors.companyPostalCode">
          <Design.TextField placeholder="Np. 12-123" v-model="invoiceInformation.companyPostalCode"/>
        </Design.FieldGroup>
        <Design.FieldGroup required label="Miasto" :error="errors.companyCity">
          <Design.TextField placeholder="Np. Warszawa, Kraków, etc." v-model="invoiceInformation.companyCity"/>
        </Design.FieldGroup>
      </Design.Row>
    </Design.Card>
  </div>
  <div class="max-w-210 mx-auto">
    <Design.Tile space>
      <Design.Row>
        <Design.RowEnd>
          <Design.Button primary @click="pay">
            Zapłać i Publikuj
          </Design.Button>
        </Design.RowEnd>
      </Design.Row>
    </Design.Tile>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {InitiatePayment, InvoiceInformation} from "../../../main";
import {PaymentMethod} from "../../../paymentProvider/PaymentProvider";
import {Design} from "../design/design";
import {DrawerOption} from "../design/Dropdown.vue";
import JobOfferStepper from '../design/JobOffer/JobOfferStepper.vue';

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOfferId: number;
}

interface Emit {
  (event: 'pay', payment: InitiatePayment): void;
  (event: 'mountCardInput', cssSelector: string): void;
  (event: 'unmountCardInput'): void;
}

function pay(): void {
  const validationError = populateErrorsAndReturn();
  if (!validationError) {
    emit('pay', {
      jobOfferId: props.jobOfferId,
      invoiceInfo: {...invoiceInformation},
      paymentMethod: method.value,
    });
  }
}

onMounted(() => emit('mountCardInput', '#creditCardInput'));
onBeforeUnmount(() => emit('unmountCardInput'));

const method = ref<PaymentMethod>('card');

const invoiceInformation: InvoiceInformation = reactive<InvoiceInformation>({
  companyName: '',
  countryCode: '',
  vatId: '',
  companyAddress: '',
  companyPostalCode: '',
  companyCity: '',
});

const paymentMethods: DrawerOption<PaymentMethod>[] = [
  {value: 'card', title: 'Karta kredytowa / debetowa'},
  {value: 'p24', title: 'BLIK lub przelew'},
];

const paymentP24Information = 'Po kliknięciu "Zapłać i zapisz", zostaniesz przekierowany do formularza płatności online.';

type Field = keyof InvoiceInformation;

const errors = reactive<Record<Field, string|null>>({
  companyName: null as string|null,
  countryCode: null as string|null,
  vatId: null as string|null,
  companyAddress: null as string|null,
  companyPostalCode: null as string|null,
  companyCity: null as string|null,
});

function populateErrorsAndReturn(): boolean {
  let validationError = false;
  for (const field of Object.keys(invoiceInformation) as Field[]) {
    if (!stringProvided(invoiceInformation[field])) {
      errors[field] = 'Uzupełnij pole.';
      validationError = true;
    } else {
      errors[field] = null;
    }
  }
  return validationError;
}

function stringProvided(string: string): boolean {
  return string.trim().length > 0;
}
</script>
