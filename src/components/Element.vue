<script setup lang="ts">
import { computed } from "vue";
import type { TElement } from "@/types";

const props = defineProps<{
  element: TElement;
}>();

const renderElement = computed(() => {
  switch (props.element.type) {
    case "container":
      return "div";
    case "link":
      return "a";
    case "paragraph":
      return "p";
    case "heading":
      return props.element.meta.tag;
    case "button":
      return "button";
    case "image":
      return "img";
    case "divider":
      return "hr";
    default:
      return "div";
  }
});
</script>

<template>
  <component :is="renderElement" :style="element.styles" v-bind="element.properties">
    <slot>
      {{ element.text }}
    </slot>
  </component>
</template>
