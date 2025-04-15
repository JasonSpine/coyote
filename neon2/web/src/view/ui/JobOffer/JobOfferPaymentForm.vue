<template>
   <Design.Card title="Płatność poprzez bezpieczne połączenie">
    Numer karty
    <div id="creditCardInput"/>
  </Design.Card>
  <Design.Tile>
    <Design.Row>
      <Design.RowEnd>
        <Design.Button primary @click="pay">
          Zapłać i Publikuj
        </Design.Button>
      </Design.RowEnd>
    </Design.Row>
  </Design.Tile>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted} from "vue";
import {Design} from "../design/design";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOfferId: number;
}

interface Emit {
  (event: 'pay', jobOfferId: number): void;
  (event: 'mountCardInput', cssSelector: string): void;
  (event: 'unmountCardInput'): void;
}

function pay(): void {
  emit('pay', props.jobOfferId);
}

onMounted(() => emit('mountCardInput', '#creditCardInput'));
onBeforeUnmount(() => emit('unmountCardInput'));
</script>
