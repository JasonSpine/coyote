<template>
  <TextInputOutline :disabled="props.disabled" :icon="props.icon" :nested="props.nested">
    <TextInput
      class="outline-none flex-grow-1"
      :type="props.formatHtml ? 'html' : 'plain'"
      :label-id="fieldLabelId"
      :test-id="props.testId"
      :placeholder="props.placeholder"
      :disabled="disabled"
      v-model="text"/>
    <slot/>
  </TextInputOutline>
</template>

<script setup lang="ts">
import {inject} from "vue";
import {IconName} from "../icons/icons";
import TextInput from "./TextInput.vue";
import TextInputOutline from "./TextInputOutline.vue";

interface Props {
  placeholder: string;
  testId?: string;
  nested?: boolean;
  disabled?: boolean;
  formatHtml?: boolean;
  icon?: IconName;
}

const text = defineModel<string>({default: ''});
const props = defineProps<Props>();
const fieldLabelId = inject<string|undefined>('fieldLabelId', undefined);
</script>
