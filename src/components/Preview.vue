<script setup lang="ts">
import type { TElement } from "@/types";
import Element from "./Element.vue";

const props = defineProps<{
  document: TElement;
}>();
</script>

<template>
  <Element :element="document">
    <template v-for="(child, index) in document.content" :key="index">
      <Preview v-if="child.meta.hasChildren" :document="child" />
      <Element v-else :element="child" />
    </template>
  </Element>
</template>
