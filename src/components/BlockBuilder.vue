<script setup lang="ts">
import { computed, ref } from "vue";
import type { TElement } from "@/types";

const OFFSET_HOVER_Y = 40;

const emit = defineEmits<{
  (e: "on-remove", block: TElement): void;
  (e: "on-click", block: TElement): void;
}>();
const { showClose = true } = defineProps<{
  showClose?: boolean;
}>();

const model = defineModel<TElement>({ type: Object, required: true });
const dragOver = ref(false);
const dragOverPosition = ref<"top" | "bottom" | "center" | null>(null);
const isCenter = computed(() => dragOverPosition.value === "center");

const handleShowDragOver = (e: DragEvent) => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  const _ = e.clientX - rect.left;
  const relativeY = e.clientY - rect.top;

  if (relativeY < OFFSET_HOVER_Y) {
    return "top";
  } else if (relativeY > rect.height - OFFSET_HOVER_Y) {
    return "bottom";
  } else {
    return "center";
  }
};

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  resetState();
  const position = handleShowDragOver(e);
  console.log(position);

  const data = e.dataTransfer?.getData("application/json");
  const parsedData = JSON.parse(data || "{}") as TElement;
  console.log(parsedData);
  const method = position === "top" ? "unshift" : "push";
  model.value.content[method](
    parsedData || {
      id: Date.now(),
      type: "Paragraph",
      text: "Paragraph",
      content: [],
    }
  );
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  dragOver.value = true;
  const position = handleShowDragOver(e);
  dragOverPosition.value = position;
};

const handleDragLeave = () => {
  resetState();
};

const handleRemove = (index: number) => {
  model.value.content = model.value.content.filter((_, i) => i !== index);
};

const handleClick = () => {
  emit("on-click", model.value);
};

const resetState = () => {
  dragOver.value = false;
  dragOverPosition.value = null;
};
</script>

<template>
  <div
    :class="[
      'border-2 relative min-h-[75px]',
      isCenter ? 'border-blue-400' : 'border-amber-500',
      !dragOver ? 'bg-amber-800 text-amber-200' : 'bg-white text-amber-800',
    ]"
    @drop.stop="handleDrop"
    @dragover.stop="handleDragOver"
    @dragleave="handleDragLeave"
    @click.stop="handleClick"
  >
    <div
      class="h-[5px] absolute top-0 left-0 w-full"
      :class="{ 'bg-blue-400': dragOverPosition === 'top' }"
    ></div>
    <div class="p-2">
      <div v-if="!model.content.length">{{ model.text }}</div>
      <div v-else>
        <BlockBuilder
          v-for="(child, index) in model.content"
          :key="index"
          v-model="model.content[index]"
          @on-remove="handleRemove(index)"
          @on-click="emit('on-click', $event)"
        />
      </div>
    </div>
    <div
      class="h-[5px] absolute bottom-0 left-0 w-full"
      :class="{ 'bg-blue-400': dragOverPosition === 'bottom' }"
    ></div>
    <button
      v-if="showClose"
      class="absolute top-[5px] right-[5px] bg-amber-700 p-0 h-5 w-5 text-white flex items-center justify-center rounded-full"
      @click="emit('on-remove', model)"
    >
      x
    </button>
  </div>
</template>

<style scoped></style>
