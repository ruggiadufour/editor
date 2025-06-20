<script setup lang="ts">
import { computed, ref, toRaw } from "vue";
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
      minHeight: "100px",
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
      allowChildrenType: ["paragraph", "image"],
    },
    properties: {
      href: location.href,
    },
    styles: {
      width: "fit-content",
      textDecoration: "underline",
      color: "blue",
      padding: "0.5rem",
      textAlign: "start",
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
      allowChildrenType: ["image", "link"],
    },
    properties: {},
    styles: {
      width: "100%",
      textAlign: "start",
    },
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
      allowChildrenType: ["image", "link"],
    },
    properties: {},
    styles: {
      width: "100%",
      textAlign: "start",
    },
  },
  {
    id: 4,
    type: "button",
    text: "Button",
    content: [],
    meta: {
      hasChildren: true,
      props: {},
      allowChildrenType: ["paragraph", "image"],
    },
    properties: {},
    styles: {
      backgroundColor: "lightblue",
      color: "black",
      padding: "10px",
      width: "fit-content",
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
      height: "100px",
      objectFit: "contain",
      display: "inline-block",
    },
  },
  {
    id: 6,
    type: "divider",
    text: "Divider",
    content: [],
    meta: {
      hasChildren: false,
      hideText: true,
      props: {},
    },
    properties: {},
    styles: {
      width: "100%",
    },
  },
];

const document = ref<TElement>(structuredClone(elementList[0]));
const selectedBlock = ref<TElement | null>(null);
const items = ref<TElement[]>(structuredClone(elementList));
const showGrid = ref(true);
const itemsBlocks = ref<TElement[]>(
  [1, 2, 3, 4, 5, 6].map((item) => {
    const element = structuredClone(elementList[0]);
    element.id = item;
    element.text = `${item} columns`;
    element.styles.display = "grid";
    element.content = Array.from({ length: item }, () => structuredClone(elementList[0]));
    element.styles.gridTemplateColumns = `repeat(${item}, 1fr)`;
    return element;
  })
);
const selectedTab = ref<"elements" | "blocks">("elements");

const handleClick = (block: TElement) => {
  selectedBlock.value = block;
  if (block.type !== "container") {
    selectedTab.value = "elements";
  }
};

const handleCreateComponent = (block: TElement) => {
  block.meta.isComponent = true;
  block.meta.props = {};
  items.value.push(block);
};
</script>

<template>
  <div class="p-2 box-border flex flex-col h-screen gap-2">
    <div class="flex items-center justify-start gap-2 bg-amber-200 h-[100px] w-full">
      <div class="h-full flex flex-col justify-between p-1">
        <button
          class="text-white px-4 py-2"
          :class="[selectedTab === 'elements' ? 'bg-amber-700' : 'bg-amber-500']"
          @click="selectedTab = 'elements'"
        >
          Elements
        </button>
        <button
          class="text-white px-4 py-2"
          :class="[selectedTab === 'blocks' ? 'bg-amber-700' : 'bg-amber-500']"
          @click="selectedTab = 'blocks'"
        >
          Blocks
        </button>
      </div>
      <DraggableItem
        v-for="element in selectedTab === 'elements' ? items : itemsBlocks"
        :key="element.id"
        :text="element.text"
        :meta="element"
      />

      <div class="flex gap-2 ml-auto justify-center items-start">
        <label class="text-black" for="showGrid">Show grid</label>
        <input type="checkbox" v-model="showGrid" id="showGrid" />
      </div>
    </div>

    <div class="flex gap-2 bg-amber-900 h-full p-2">
      <div class="h-full w-2/3 bg-amber-800 flex flex-col justify-between">
        <BlockBuilder
          v-model="document"
          :show-close="false"
          :show-grid="showGrid"
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
