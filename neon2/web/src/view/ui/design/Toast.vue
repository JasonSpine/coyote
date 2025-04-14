<template>
  <div class="border p-4 rounded-lg flex">
    <Icon name="toastInfo" class="mr-2"/>
    <p v-text="props.title" class="font-bold mr-auto"/>
    <Icon name="toastClose"/>
  </div>
</template>

<script setup lang="ts">
import Icon from "../icons/Icon.vue";

const props = defineProps<Props>();

interface Props {
  title: string;
}
</script>
