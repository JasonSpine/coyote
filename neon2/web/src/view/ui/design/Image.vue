<template>
  <div
    class="size-14 rounded-lg overflow-hidden"
    :class="[{'border border-4 border-tile box-content': props.border}]">
    <img v-if="props.src" :src="props.src" class="bg-tile"/>
    <div v-else :class="[
      'size-14 rounded flex-shrink-0',
      'flex items-center justify-center',
      'bg-accent-back text-accent-front'
    ]">
      <Icon :name="props.placeholderIcon"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon, {IconName} from "../icons/Icon.vue";

const props = defineProps<Props>();

interface Props {
  src: string|null;
  placeholderIcon: IconName;
  border?: boolean;
}
</script>
