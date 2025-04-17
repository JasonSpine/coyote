<template>
  <h1>
    Ogłoszenie: {{props.jobOffer.title}}
  </h1>
  <div>
    Ogłoszenie wygasa za:
    <span data-testid="jobOfferExpiresInDays" v-text="props.jobOffer.expiresInDays"/>
    dni
  </div>
  <div>
    <span data-testid="jobOfferDescription" v-text="props.jobOffer.description"/>
  </div>
  <button @click="editJob">Edytuj</button>
</template>

<script setup lang="ts">
import {JobOffer} from '../../../jobBoard';

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOffer: JobOffer;
}

interface Emit {
  (event: 'edit', id: number): void;
}

function editJob(): void {
  emit('edit', props.jobOffer.id);
}
</script>
