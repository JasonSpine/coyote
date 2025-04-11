<template>
  <p>Znajdź najlepszych programistów szybciej i skuteczniej!</p>
  <p>4programmers każdego miesiąca odwiedza ponad 150 000+ programistów.</p>
  <Design.Button primary @click="emit('select', 'free')">
    Publikuj ogłoszenie
  </Design.Button>
  <Design.Button primary @click="emit('select', 'paid')">
    Kup ogłoszenie
  </Design.Button>
</template>

<script setup lang="ts">
import {Design} from "../design/design";

const emit = defineEmits<Emit>();

interface Emit {
  (event: 'select', plan: 'free'|'paid'): void;
}
</script>
