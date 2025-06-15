<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { TElement } from "@/types";
import Element from "./Element.vue";
import { useTemplateRef } from "vue";
import type { CSSProperties } from "vue";
import { watch } from "vue";

const OFFSET_HOVER_Y = 40;
let resizeObserver: ResizeObserver | null = null;

const emit = defineEmits<{
  (e: "on-remove", block: TElement): void;
  (e: "on-click", block: TElement): void;
}>();
const { showClose = true } = defineProps<{
  showClose?: boolean;
}>();

const model = defineModel<TElement>({ type: Object, required: true });
const componentRef = useTemplateRef("componentRef");
const dragOver = ref(false);
const dragOverPosition = ref<"top" | "bottom" | "center" | null>(null);
const isCenter = computed(() => dragOverPosition.value === "center");
const enableDrop = computed(() => model.value.meta.hasChildren);
const builderStyle = ref<CSSProperties>({});

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
  console.log(enableDrop.value);
  if (!enableDrop.value) return;
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

const updateBuilderStyle = (entry: ResizeObserverEntry) => {
  const rect = entry.target?.getBoundingClientRect();
  builderStyle.value = {
    width: `${rect?.width || 0}px`,
    height: `${rect?.height || 0}px`,
    left: `${rect?.left || 0}px`,
    top: `${rect?.top || 0}px`,
  };
};

onMounted(() => {
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      console.log(entry);

      updateBuilderStyle(entry);
    }
  });
  console.log(componentRef.value?.$el);
  if (componentRef.value?.$el) {
    resizeObserver.observe(componentRef.value.$el as HTMLElement);
  }
});

watch(
  () => componentRef.value,
  (newVal) => {
    console.log(newVal?.$el);
    if (newVal?.$el) {
      resizeObserver?.observe(newVal.$el as HTMLElement);
    }
  }
);
</script>

<template>
  <div
    v-if="builderStyle"
    :style="builderStyle"
    :class="[
      'absolute outline-1 group',
      isCenter ? 'outline-blue-400' : 'outline-amber-500',
      dragOver ? 'outline-3' : '',
    ]"
    class="hover:outline-"
    @drop.stop="handleDrop"
    @dragover.stop="handleDragOver"
    @dragleave="handleDragLeave"
    @click.stop="handleClick"
  >
    <div
      class="h-[5px] absolute top-0 left-0 w-full"
      :class="{ 'bg-blue-400': dragOverPosition === 'top' }"
    ></div>
    <div
      class="h-[5px] absolute bottom-0 left-0 w-full"
      :class="{ 'bg-blue-400': dragOverPosition === 'bottom' }"
    ></div>

    <button
      v-if="showClose"
      class="absolute top-[-10px] right-[-10px] bg-amber-700 p-0 h-5 w-5 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      @click="emit('on-remove', model)"
    >
      x
    </button>
  </div>

  <Element ref="componentRef" :element="model">
    <BlockBuilder
      v-if="model.meta.hasChildren || model.content.length"
      v-for="(child, index) in model.content"
      :key="index"
      v-model="model.content[index]"
      @on-remove="handleRemove(index)"
      @on-click="emit('on-click', $event)"
    />
  </Element>
</template>

<style scoped></style>
