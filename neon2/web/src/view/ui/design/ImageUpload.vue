<template>
  <div v-if="hasImage" class="size-70 rounded-xl" @click="removeImage">
    <img :src="imageUrl" alt="Uploaded image" class="object-cover size-full rounded-xl"/>
  </div>
  <div v-else :class="[
      'size-70 rounded-xl cursor-pointer',
      'border border-dashed border-neutral-100',
      'flex justify-center items-center',
      'relative']">
    <input
      type="file"
      accept="image/jpeg,image/png"
      @change="fileChanged"
      class="absolute opacity-0 size-full left-0 top-0 cursor-pointer"/>
    <span v-if="uploading">Przesyłanie...</span>
    <Icon v-else name="jobOfferUploadCompanyLogo" class="text-2xl color-neutral-500"/>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {UploadImage} from "../../../main";
import Icon from "../icons/Icon.vue";

interface Props {
  upload: UploadImage;
}

const props = defineProps<Props>();
const imageUrl = defineModel<string|null>();
const uploading = ref<boolean>(false);
const hasImage = computed(() => !!imageUrl.value);

function fileChanged(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    uploadFile(file);
  }
}

function uploadFile(file: File): void {
  uploading.value = true;
  props.upload(file)
    ?.then((uploadedImageUrl: string) => {
      imageUrl.value = uploadedImageUrl;
    })
    ?.finally(() => {
      uploading.value = false;
    });
}

function removeImage(): void {
  imageUrl.value = null;
}
</script>
