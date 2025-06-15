<script setup lang="ts">
import type { TElement } from "@/types";
import { useGeneralStore } from "@/stores/general";
import { storeToRefs } from "pinia";
import { toRaw } from "vue";

const props = defineProps<{
  text: string;
  meta: TElement;
}>();
const generalStore = useGeneralStore();
const { elementDragging } = storeToRefs(generalStore);

const handleDragStart = (e: DragEvent) => {
  if (props.meta.meta.isComponent) {
    elementDragging.value = props.meta;
  } else {
    elementDragging.value = structuredClone(toRaw(props.meta));
  }
};
</script>

<template>
  <div
    class="p-4 bg-amber-500 text-amber-950 font-bold"
    draggable="true"
    @dragstart="handleDragStart"
  >
    {{ text }}
  </div>
</template>
