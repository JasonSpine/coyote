<template>
  <i :class="{'fa-fw': props.fixedWidth}"/>
</template>

<script setup lang="ts">
const props = defineProps<Props>();

interface Props {
  fixedWidth?: boolean;
}
</script>

<style>
@use "../../../node_modules/@fortawesome/fontawesome-free/css/fontawesome.css";

.fa-solid {
  font-family: 'Font Awesome 6 Free';
  font-style: normal;
  font-weight: 900;
  display: inline-block;
}

.fa-regular {
  font-family: 'Font Awesome 6 Pro';
  font-style: normal;
  font-weight: 400;
  display: inline-block;
}

.fa-light {
  font-family: 'Font Awesome 6 Pro';
  font-style: normal;
  font-weight: 300;
  display: inline-block;
}

.fa-light,
.fa-regular,
.fa-solid {
  &:before {
    content: var(--fa);
  }
}
</style>
