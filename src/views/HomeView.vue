<script setup lang="ts">
import { ref, toRaw } from "vue";
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
      props: {},
    },
    properties: {},
    styles: {
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
      props: {},
    },
    properties: {
      href: location.href,
    },
    styles: {
      textDecoration: "underline",
      color: "blue",
      padding: "1rem",
      display: "inline-block",
    },
  },
  {
    id: 2,
    type: "paragraph",
    text: "Paragraph",
    content: [],
    meta: {
      hasChildren: false,
      props: {},
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
      tag: "h1",
      props: {},
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
      props: {},
    },
    properties: {},
    styles: {
      backgroundColor: "lightblue",
      color: "black",
      padding: "10px",
      width: "auto",
    },
  },
  {
    id: 5,
    type: "image",
    text: "Image",
    content: [],
    meta: {
      hasChildren: false,
      props: {},
    },
    properties: {
      src:
        "https://static.semrush.com/blog/uploads/media/39/4f/394f92fd06792246f5833d1ab3c05c4d/reverse-image-search.svg",
    },
    styles: {
      width: "100px",
      height: "auto",
    },
  },
];

const document = ref<TElement>(structuredClone(elementList[0]));
const selectedBlock = ref<TElement | null>(null);
const items = ref<TElement[]>(structuredClone(elementList));

const handleClick = (block: TElement) => {
  selectedBlock.value = block;
};

const handleCreateComponent = (block: TElement) => {
  block.meta.isComponent = true;
  block.meta.props = {};
  items.value.push(block);
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
        <BlockBuilder
          v-model="document"
          :show-close="false"
          @on-click="handleClick"
          @on-create-component="handleCreateComponent"
        />
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
