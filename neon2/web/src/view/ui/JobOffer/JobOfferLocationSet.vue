<template>
  <Design.FieldGroup label="Lokalizacja" v-for="(location, index) in locations">
    <div class="flex gap-1 items-center">
      <Design.TextField
        class="flex-grow-1"
        :placeholder="placeholder(index)"
        icon="jobOfferLocation"
        :model-value="location"
        @update:model-value="url => updateLocation(url, index)"
      />
      <Design.Button square outline icon="remove" @click="removeLocation(index)"/>
    </div>
  </Design.FieldGroup>
  <Design.Button primary-outline icon="add" @click="add">
    Dodaj lokalizację
  </Design.Button>
</template>

<script setup lang="ts">
import {Design} from "../design/design";

const locations = defineModel<string[]>({required: true});

function updateLocation(location: string, index: number): void {
  const urls: string[] = [...locations.value];
  urls.splice(index, 1, location);
  locations.value = urls.filter(image => image !== null);
}

function removeLocation(index: number): void {
  const urls: string[] = [...locations.value];
  urls.splice(index, 1);
  locations.value = urls;
}

function add(): void {
  locations.value.push('');
}

function placeholder(index: number): string {
  const placeholders = [
    'np. Warszawa, al. Jerozolimskie 3',
    'np. Kraków, al. Juliusza Słowackiego 12',
    'np. Wrocław, ul. Józefa Piłsudskiego 24',
  ];
  return placeholders[index % placeholders.length];
}
</script>
