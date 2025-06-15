<script setup lang="ts">
import { ref } from "vue";
import BlockBuilder from "@/components/BlockBuilder.vue";
import DraggableItem from "@/components/DraggableItem.vue";
import type { TElement } from "@/types";

const document = ref<TElement>({
  id: 1,
  type: "container",
  text: "Container",
  content: [],
});
const selectedBlock = ref<TElement | null>(null);
const items = ref<TElement[]>([
  {
    id: 1,
    type: "container",
    text: "Container",
    content: [],
  },
  {
    id: 1,
    type: "link",
    text: "Link",
    content: [],
  },
  {
    id: 2,
    type: "paragraph",
    text: "Paragraph",
    content: [],
  },
  {
    id: 3,
    type: "heading",
    text: "Heading",
    content: [],
  },
  {
    id: 4,
    type: "button",
    text: "Button",
    content: [],
  },
]);

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

    <div class="flex gap-2">
      <div class="h-full w-2/3">
        <BlockBuilder v-model="document" :show-close="false" @on-click="handleClick" />
      </div>
      <div class="h-full w-1/3">
        <BlockBuilder v-if="selectedBlock" v-model="selectedBlock" :show-close="false" />
        {{ selectedBlock }}
      </div>
    </div>
  </div>
</template>
