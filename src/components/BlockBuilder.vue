<script setup lang="ts">
import { computed, ref, useId } from "vue";
import type { TElement } from "@/types";
import Element from "./Element.vue";
import { useGeneralStore } from "@/stores/general";
import { storeToRefs } from "pinia";

const OFFSET_HOVER_Y = 40;
const OFFSET_HOVER_PREV_Y = 8; // 0.5rem

type DragOverPosition = "top-prev" | "left-prev" | "top" | "bottom" | "center" | number;

const emit = defineEmits<{
  (e: "on-remove", block: TElement): void;
  (e: "on-click", block: TElement): void;
  (e: "on-create-component", block: TElement): void;
  (e: "on-drop-prev", direction: "top" | "left"): void;
}>();
const { showClose = true, disabled = false, dropPrev = true } = defineProps<{
  showClose?: boolean;
  disabled?: boolean;
  showGrid?: boolean;
  dropPrev?: boolean;
}>();

const model = defineModel<TElement>({ type: Object, required: true });
const generalStore = useGeneralStore();
const id = useId();
const { elementDragging } = storeToRefs(generalStore);

const dragOver = ref(false);
const dragOverPosition = ref<DragOverPosition | number | null>(null);
const isCenter = computed(() => dragOverPosition.value === "center");
const enableDrop = computed(() => model.value.meta.hasChildren && !disabled);

const isResizing = ref(false);
const startX = ref(0);
const startY = ref(0);
const startWidth = ref(0);
const startHeight = ref(0);
const contextMenu = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const resizeDirection = ref<"left" | "right" | "top" | "bottom" | null>(null);

const handleShowDragOver = (
  e: DragEvent,
  index: number | null = null
): DragOverPosition => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  if (index !== null) {
    return index;
  }

  const _ = e.clientX - rect.left;
  const relativeY = e.clientY - rect.top;
  const relativeX = e.clientX - rect.left;

  if (relativeY < OFFSET_HOVER_PREV_Y) {
    return "top-prev";
  } else if (relativeX < OFFSET_HOVER_PREV_Y) {
    return "left-prev";
  } else if (relativeY < OFFSET_HOVER_Y) {
    return "top";
  } else if (relativeY > rect.height - OFFSET_HOVER_Y) {
    return "bottom";
  } else {
    return "center";
  }
};

const handleDropPrev = (_: "top" | "left", index: number) => {
  if (!elementDragging.value) return;
  model.value.content.splice(index, 0, elementDragging.value);
};

const handleDrop = (e: DragEvent, index: number | null = null) => {
  e.preventDefault();
  const allowChildrenType = model.value.meta.allowChildrenType;
  resetState();

  const targetElement = e.target as HTMLElement;
  const position = targetElement.dataset.position as "top" | "left" | undefined;
  if (dropPrev && position) return emit("on-drop-prev", position);

  if (
    (allowChildrenType && !allowChildrenType.includes(elementDragging.value?.type!)) ||
    !enableDrop.value ||
    !elementDragging.value
  )
    return;

  if (index !== null) {
    // @ts-ignore
    model.value.content.splice(index + 1, 0, elementDragging.value);
    emit("on-click", elementDragging.value);
  } else {
    const position = handleShowDragOver(e, index);
    const method = position === "top" ? "unshift" : "push";
    // @ts-ignore
    model.value.content[method](elementDragging.value);
    emit("on-click", elementDragging.value);
  }
};

const handleDragOver = (e: DragEvent, index: number | null = null) => {
  e.preventDefault();
  dragOver.value = true;
  if (index !== null) {
    dragOverPosition.value = index;
  } else {
    const position = handleShowDragOver(e);
    dragOverPosition.value = position;
  }
  console.log(dragOverPosition.value);
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

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  console.log("context menu");
  contextMenu.value = {
    x: e.clientX,
    y: e.clientY,
  };
};

const resetState = () => {
  dragOver.value = false;
  dragOverPosition.value = null;
};

const handleResizeStart = (
  e: MouseEvent,
  direction: "left" | "right" | "top" | "bottom"
) => {
  e.preventDefault();
  isResizing.value = true;
  resizeDirection.value = direction;
  startX.value = e.clientX;
  startY.value = e.clientY;
  startWidth.value = parseInt(model.value.styles.width?.toString() || "0");
  if (isNaN(startWidth.value)) {
    startWidth.value = 0;
  }
  startHeight.value = parseInt(model.value.styles.height?.toString() || "0");
  if (isNaN(startHeight.value)) {
    startHeight.value = 0;
  }

  document.addEventListener("mousemove", handleResizeMove);
  document.addEventListener("mouseup", handleResizeEnd);
};

const handleResizeMove = (e: MouseEvent) => {
  if (!isResizing.value) return;

  const deltaX = e.clientX - startX.value;
  const deltaY = e.clientY - startY.value;

  switch (resizeDirection.value) {
    case "left":
      model.value.styles.width = `${Math.max(0, startWidth.value - deltaX)}px`;
      break;
    case "right":
      model.value.styles.width = `${Math.max(0, startWidth.value + deltaX)}px`;
      break;
    case "top":
      model.value.styles.height = `${Math.max(0, startHeight.value - deltaY)}px`;
      break;
    case "bottom":
      model.value.styles.height = `${Math.max(0, startHeight.value + deltaY)}px`;
      break;
  }
};

const handleResizeEnd = () => {
  isResizing.value = false;
  resizeDirection.value = null;
  document.removeEventListener("mousemove", handleResizeMove);
  document.removeEventListener("mouseup", handleResizeEnd);
};

const handleCreateComponent = () => {
  emit("on-create-component", model.value);
};
</script>

<template>
  <div
    :class="[
      'relative hover:outline- group left-0 top-0 hover:outline-blue-400',
      showGrid ? 'outline-1 outline-dashed' : '',
      isCenter ? 'outline-blue-400' : 'outline-amber-500',
      dragOver ? 'outline-3' : '',
    ]"
    :style="{
      ...model.styles,
      padding: 0,
    }"
    :id="id"
    @drop.stop="handleDrop"
    @dragover.stop="handleDragOver"
    @dragleave="handleDragLeave"
    @click.stop="handleClick"
    @contextmenu="handleContextMenu"
  >
    <div class="absolute left-0 top-0 w-full h-full text-black">
      <div
        class="absolute right-0 w-3 bg-transparent h-full cursor-col-resize"
        @click.stop
        @mousedown.stop="handleResizeStart($event, 'right')"
      ></div>
      <div
        class="absolute left-0 w-3 bg-transparent h-full cursor-col-resize"
        @click.stop
        @mousedown.stop="handleResizeStart($event, 'left')"
      ></div>
      <div
        class="absolute top-0 w-full bg-transparent h-3 cursor-row-resize"
        @click.stop
        @mousedown.stop="handleResizeStart($event, 'top')"
      ></div>
      <div
        class="absolute bottom-0 w-full bg-transparent h-3 cursor-row-resize"
        @click.stop
        @mousedown.stop="handleResizeStart($event, 'bottom')"
      ></div>
    </div>

    <div
      data-position="top"
      class="absolute left-[-0.5rem] top-[-0.5rem] w-[calc(100%+0.5rem)] h-[1rem]"
      :class="dragOverPosition === 'top-prev' ? 'bg-blue-500/50' : 'bg-transparent'"
    ></div>
    <div
      data-position="left"
      class="absolute left-[-0.5rem] top-[-0.5rem] h-[calc(100%+0.5rem)] w-[1rem]"
      :class="dragOverPosition === 'left-prev' ? 'bg-blue-500/50' : 'bg-transparent'"
    ></div>
    <Element :element="model">
      <template #element="{ tag }">
        <component
          :is="tag"
          v-bind="model.properties"
          :style="{
            padding: model.styles.padding,
            width: 'inherit',
            height: 'inherit',
            flex: 'inherit',
            display: 'inherit',
            alignItems: 'inherit',
            justifyContent: 'inherit',
            flexDirection: 'inherit',
            flexWrap: 'inherit',
            flexGrow: 'inherit',
            flexShrink: 'inherit',
            gap: 'inherit',
          }"
        >
          <BlockBuilder
            v-if="model.meta.hasChildren && model.content.length"
            v-for="(child, index) in model.content"
            :key="index"
            v-model="model.content[index]"
            :disabled="!enableDrop"
            :show-grid="showGrid"
            @on-drop-prev="handleDropPrev($event, index)"
            @on-remove="handleRemove(index)"
            @on-click="emit('on-click', $event)"
            @on-create-component="emit('on-create-component', $event)"
          />
          {{
            !(model.meta.hasChildren && model.content.length) && !model.meta.hideText
              ? model.text
              : ""
          }}
        </component>
      </template>
    </Element>
  </div>
</template>

<style scoped></style>
