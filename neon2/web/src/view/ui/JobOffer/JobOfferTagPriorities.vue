<template>
  <div class="flex flex-wrap gap-4 items-center">
    <div v-for="tag in props.tags">
      <TagName v-text="tag.tagName"/>
      <JobOfferTagPriority :priority="tag.priority"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Tag} from "../../../main";
import TagName from "../design/TagName.vue";
import JobOfferTagPriority from "./JobOfferTagPriority.vue";

const props = defineProps<Props>();

interface Props {
  tags: Tag[];
}
</script>
