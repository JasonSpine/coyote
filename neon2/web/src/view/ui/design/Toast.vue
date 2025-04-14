<template>
  <div class="border p-4 rounded-lg flex">
    <Icon name="toastInfo" class="mr-2"/>
    <p class="font-bold mr-auto"
       :data-testid="props.testId"
       :data-test-value="props.testValue"
       v-text="props.title"/>
    <Icon name="toastClose"/>
  </div>
</template>

<script setup lang="ts">
import Icon from "../icons/Icon.vue";

const props = defineProps<Props>();

interface Props {
  title: string;
  testId?: string;
  testValue?: string;
}
</script>
