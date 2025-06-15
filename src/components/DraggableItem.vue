<script setup lang="ts">
import type { TElement } from "@/types";

const props = defineProps<{
  text: string;
  meta: TElement;
}>();

const handleDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData("application/json", JSON.stringify(props.meta));
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
