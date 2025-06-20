<script setup lang="ts">
import { computed, useId } from "vue";
import type { TElement } from "@/types";

const props = defineProps<{
  element: TElement;
  elementClass?: string | string[];
  id?: string;
}>();

const genId = props.id || useId();

const emit = defineEmits<{
  (e: "drop", event: DragEvent): void;
  (e: "dragover", event: DragEvent): void;
  (e: "dragleave", event: DragEvent): void;
  (e: "click", event: MouseEvent): void;
  (e: "contextmenu", event: MouseEvent): void;
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
    case "list":
      return "ul";
    case "list-item":
      return "li";
    default:
      return "div";
  }
});
</script>

<template>
  <slot
    name="element"
    :tag="renderElement"
    :element="element"
    :properties="element.properties"
  >
    <component
      :is="renderElement"
      :style="element.styles"
      :class="elementClass || ''"
      v-bind="element.properties"
      :id="genId"
      @drop.stop="emit('drop', $event)"
      @dragover.stop="emit('dragover', $event)"
      @dragleave="emit('dragleave', $event)"
      @click.stop="emit('click', $event)"
      @contextmenu="emit('contextmenu', $event)"
    >
      <slot>
        {{ element.meta.hideText ? "" : element.text }}
      </slot>
    </component>
  </slot>
</template>
