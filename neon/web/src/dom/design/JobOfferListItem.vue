<template>
  <Design.Tile vertical>
    <Design.Row>
      <Design.Tile nested-pill icon="jobOfferLocation" v-for="location in jobOffer.locations">
        {{ location }}
      </Design.Tile>
      <Design.Tile nested-pill icon="jobOfferWorkModeRemote" v-if="jobOffer.workMode === 'fullyRemote'">
        Praca zdalna
      </Design.Tile>
      <Design.Tile nested-pill icon="jobOfferWorkModeHybrid" v-if="jobOffer.workMode === 'hybrid'">
        Praca hybrydowa
      </Design.Tile>
      <Design.Tile nested-pill icon="jobOfferWorkModeStationary" v-if="jobOffer.workMode === 'stationary'">
        Praca stacjonarna
      </Design.Tile>
      <Design.Tile nested-pill v-text="jobOfferLegalFormTitle"/>
    </Design.Row>
    <Design.Tile nested>
      <div class="flex space-x-2">
        <div class="size-12 rounded flex-shrink-0 flex items-center justify-center bg-accent-back text-accent-front">
          <Icon name="jobOfferLogoPlaceholder"/>
        </div>
        <div class="flex-grow-1">
          <p class="text-lg leading-6" data-testid="jobOfferTitle">
            <a :href="jobOffer.url" v-text="jobOffer.title"/>
          </p>
          <div class="flex space-x-2 max-md:hidden">
            <span>{{ jobOffer.companyName }}</span>
            <Design.TagList :tag-names="jobOffer.tagNames" :max="5"/>
          </div>
        </div>
        <div v-if="jobOffer.salary" class="max-md:hidden">
          <Design.Salary :salary="jobOffer.salary"/>
        </div>
      </div>
      <div class="md:hidden">
        <Design.Divider/>
        <Design.Row vertical-center>
          <span>{{ jobOffer.companyName }}</span>
          <Design.RowEnd>
            <Design.Salary v-if="jobOffer.salary" :salary="jobOffer.salary"/>
          </Design.RowEnd>
        </Design.Row>
        <template v-if="jobOffer.tagNames.length">
          <Design.Divider/>
          <Design.TagList :tag-names="jobOffer.tagNames" :max="5"/>
        </template>
      </div>
    </Design.Tile>
  </Design.Tile>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {LegalForm} from "../../filters";
import {VueJobOffer} from "../../Main.vue";
import Icon from "../component/Icon.vue";
import {Design} from "./design";

interface Props {
  jobOffer: VueJobOffer;
}

const props = defineProps<Props>();

const jobOfferLegalFormTitle = computed((): string => {
  const titles: Record<LegalForm, string> = {
    'fullTime': 'Pełny etat',
    'contract': 'Kontrakt',
    'partTime': 'Praca dorywcza',
  };
  return titles[props.jobOffer.legalForm];
});
</script>
