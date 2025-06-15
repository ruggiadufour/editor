<script setup lang="ts">
import { ref } from "vue";
import BlockBuilder from "@/components/BlockBuilder.vue";
import DraggableItem from "@/components/DraggableItem.vue";
import type { TElement } from "@/types";
import ElementConfig from "@/components/ElementConfig.vue";
import Preview from "@/components/Preview.vue";

const elementList: TElement[] = [
  {
    id: 1,
    type: "container",
    text: "Container",
    content: [],
    meta: {
      hasChildren: true,
    },
    properties: {},
    styles: {
      minHeight: "100px",
      width: "100%",
      padding: "10px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "0.5rem",
    },
  },
  {
    id: 1,
    type: "link",
    text: "Link",
    content: [],
    meta: {
      hasChildren: false,
    },
    properties: {
      href: location.href,
    },
    styles: {
      textDecoration: "underline",
      color: "blue",
    },
  },
  {
    id: 2,
    type: "paragraph",
    text: "Paragraph",
    content: [],
    meta: {
      hasChildren: false,
    },
    properties: {},
    styles: {},
  },
  {
    id: 3,
    type: "heading",
    text: "Heading",
    content: [],
    meta: {
      hasChildren: false,
    },
    properties: {},
    styles: {},
  },
  {
    id: 4,
    type: "button",
    text: "Button",
    content: [],
    meta: {
      hasChildren: false,
    },
    properties: {},
    styles: {
      backgroundColor: "lightblue",
      color: "black",
      padding: "10px",
      width: "100px",
    },
  },
];

const document = ref<TElement>(structuredClone(elementList[0]));
const selectedBlock = ref<TElement | null>(null);
const items = ref<TElement[]>(structuredClone(elementList));

const handleClick = (block: TElement) => {
  selectedBlock.value = block;
};
</script>

<template>
  <div class="p-2 box-border flex flex-col h-screen gap-2">
    <div class="flex items-center justify-center gap-2 bg-amber-200 h-[100px] w-full">
      <DraggableItem
        v-for="item in items"
        :key="item.id"
        :text="item.text"
        :meta="item"
      />
    </div>

    <div class="flex gap-2 bg-amber-900 h-full p-2">
      <div class="h-full w-2/3 bg-amber-800 flex flex-col justify-between">
        <BlockBuilder v-model="document" :show-close="false" @on-click="handleClick" />
        <Preview :document="document" />
      </div>
      <div class="h-full w-1/3">
        <button @click="selectedBlock = null">Remove selected block</button>
        <div v-if="selectedBlock" class="space-y-4">
          <ElementConfig v-model="selectedBlock" />
        </div>
      </div>
    </div>
  </div>
</template>
