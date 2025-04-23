<template>
  <Design.Tile vertical>
    <Design.Row wrap vertical-center>
      <Design.Tile nested-pill v-for="badge in badges" :text="badge.title" :icon="badge.icon"/>
      <Design.RowEnd inline>
        <Design.JobOfferBadge color="pink" v-text="'Nowe'" v-if="jobOffer.isNew" text-small/>
        <Design.JobOfferFavouriteButton
          :favourite="jobOffer.isFavourite"
          @favourite-change="toggleFavourite"/>
      </Design.RowEnd>
    </Design.Row>
    <Design.Tile nested desktop-space>
      <Design.Row vertical-center>
        <Design.Image :src="props.jobOffer.companyLogoUrl" placeholder-icon="jobOfferLogoPlaceholder"/>
        <div class="flex-grow-1">
          <Design.Row vertical-center apart>
            <p
              class="text-lg leading-6 cursor-pointer"
              v-text="jobOffer.title"
              data-testid="jobOfferTitle"
              @click="emit('select')"/>
            <div class="max-md:hidden">
              <Design.JobOfferSalary :salary="jobOffer" v-if="jobOffer.salaryRangeFrom"/>
              <Design.JobOfferSalaryNotProvided v-else/>
            </div>
          </Design.Row>
          <Design.Row apart class="max-md:hidden mt-2" vertical-center>
            <Design.Row vertical-center class="space-x-2">
              <span v-if="jobOffer.companyName" v-text="jobOffer.companyName" class="text-neutral-900 dark:text-neutral-050"/>
              <Design.JobOfferTagList :tag-names="jobOffer.tagNames" :max="5"/>
            </Design.Row>
            <Design.Row class="space-x-2 text-sm">
              <div v-for="badge in badges" :class="{'text-word-standout': badge.standout}">
                <Icon :name="badge.icon" v-if="badge.icon"/>
                {{badge.title}}
              </div>
            </Design.Row>
          </Design.Row>
        </div>
      </Design.Row>
      <div class="md:hidden">
        <Design.Divider/>
        <Design.Row wrap vertical-center>
          <span>{{jobOffer.companyName}}</span>
          <Design.RowEnd>
            <Design.JobOfferSalary :salary="jobOffer" v-if="jobOffer.salaryRangeFrom"/>
            <Design.JobOfferSalaryNotProvided v-else/>
          </Design.RowEnd>
        </Design.Row>
        <template v-if="jobOffer.tagNames.length">
          <Design.Divider/>
          <Design.Row>
            <Design.JobOfferTagList :tag-names="jobOffer.tagNames" :max="5"/>
          </Design.Row>
        </template>
      </div>
    </Design.Tile>
  </Design.Tile>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {JobOffer} from "../../../../jobBoard";
import {formatLegalForm, formatWorkMode} from "../../format";
import Icon, {IconName} from "../../icons/Icon.vue";
import {Design} from "../design";

const props = defineProps<Props>();
const emit = defineEmits<Emit>();

interface Props {
  jobOffer: JobOffer;
}

interface Emit {
  (event: 'favouriteChange', favourite: boolean): void;
  (event: 'select');
}

function toggleFavourite(newValue: boolean): void {
  emit('favouriteChange', newValue);
}

const badges = computed<Badge[]>((): Badge[] => {
  return [
    ...locationBadges.value,
    workModeBadge.value,
    {title: legalFormTitle.value, standout: true},
  ];
});

const workModeBadge = computed<Badge>((): Badge => ({title: formatWorkMode(props.jobOffer.workMode)}));

const locationBadges = computed<Badge[]>((): Badge[] => {
  return props.jobOffer.locations.map(location => ({
    icon: 'jobOfferLocation',
    title: location,
  }));
});

const legalFormTitle = computed((): string => formatLegalForm(props.jobOffer.legalForm));

interface Badge {
  title: string;
  icon?: IconName;
  standout?: boolean;
}
</script>
