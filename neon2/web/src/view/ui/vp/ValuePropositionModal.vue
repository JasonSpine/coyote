<template>
  <div class="relative">
    <div class="backdrop-blur-xs fixed w-full h-full z-[1] flex justify-center items-center">
      <div class="min-h-88 rounded-lg bg-tile overflow-hidden -mt-12 flex max-md:flex-col">
        <img class="w-full max-md:h-48 md:w-64 lg:w-88 object-cover" :src="logo" alt="4programmers.net"/>
        <div class="flex flex-col justify-between p-4">
          <template v-if="!secondScreen">
            <div class="space-y-4">
              <h2 class="font-semibold text-lg">
                Chcesz zwiększyć swoje szanse?
              </h2>
              <h3 class="font-medium">Skorzystaj z usług agenta 4programmers, a zyskasz:</h3>
              <ul class="list-disc pl-4">
                <li>CV konkurencji (zanonimizowane) – zobacz, z kim rywalizujesz.</li>
                <li>Informacja, gdzie i dlaczego odpadli inni.</li>
                <li>Gwarancja odpowiedzi – jeśli firma milczy, my ich przypilnujemy.</li>
                <li>Notatki z rozmów z rekruterem.</li>
              </ul>
            </div>
            <div class="flex flex-col space-y-2 mt-8">
              <Design.Button primary @click="accept(true)">Tak</Design.Button>
              <Design.Button primary-outline @click="accept(false)">Nie jestem zainteresowany</Design.Button>
            </div>
          </template>
          <template v-else>
            <div class="max-w-94 space-y-4">
              <h2 class="font-semibold text-lg">
                Skorzystaj z agenta 4programmers
              </h2>
              <p>
                Pomożemy Ci przejść rekrutację w <span class="font-medium">[nazwa firmy]</span>
                krok po kroku z <b>gwarancją feedbacku</b>.
              </p>
              <p>Zostaw swój adres e-mail, a zaprosimy Cię na rozmowę.</p>
            </div>
            <Design.TextField placeholder="Twój adres e-mail" class="mt-4 mb-2"/>
            <Design.Button primary>Zapisz</Design.Button>
            <Design.Button primary-outline class="mt-auto">Kontynuuj aplikację</Design.Button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {Design} from "../design/design";
import logo from "./survey.svg";

const emit = defineEmits<Emits>();

const secondScreen = ref(false);

interface Emits {
  (event: 'accept', accepted: boolean): void;
}

function accept(accepted: boolean): void {
  // emit('accept', accepted);
  secondScreen.value = true;
}
</script>
