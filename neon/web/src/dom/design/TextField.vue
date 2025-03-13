<template>
  <div class="bg-tile-nested rounded-lg p-3 flex">
    <input
      class="outline-none flex-grow-1"
      :data-testid="props.testId"
      :placeholder="props.placeholder"
      v-model="text">
    <slot/>
  </div>
</template>
<script setup lang="ts">
interface Props {
  placeholder: string;
  testId: string;
}

const props = defineProps<Props>();
const text = defineModel();
</script>
<!--<input class="flex-grow-1" placeholder="Szukaj po tytule, nazwie firmy" v-model="searchPhrase">-->
<!--<button class="button py-1 p-3 cursor-pointer" @click="search" data-testid="search">-->
<!--  <Icon name="jobOfferSearch"/>-->
<!--</button>-->
