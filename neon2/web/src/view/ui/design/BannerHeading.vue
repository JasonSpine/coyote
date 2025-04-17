<template>
  <Design.Tile space class="tile-highlight-long dark:tile-highlight">
    <p class="mb-1 text-sm text-word-accent">
      4programmers
      <span @click="emit('back')" class="cursor-pointer">
        » Praca
      </span>
      <span v-if="props.back">
        » Ogłoszenie
      </span>
    </p>
    <h1 class="text-xl leading-6 font-semibold text-word-standout max-md:hidden">
      Oferty Pracy w IT - Odwiedza nas ponad 150 tys. programistów miesięcznie
    </h1>
    <h1 class="mb-1 text-xl leading-6 font-semibold text-word-standout md:hidden">
      Oferty Pracy w IT
    </h1>
    <h2 class="md:hidden">
      Odwiedza nas ponad 150 tys. programistów miesięcznie
    </h2>
  </Design.Tile>
</template>

<script setup lang="ts">
import {Design} from './design.ts';

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  back?: boolean;
}

interface Emit {
  (event: 'back'): void;
}
</script>
