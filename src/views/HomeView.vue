<script setup lang="ts">
import { computed, onMounted, ref, toRaw } from "vue";
import BlockBuilder from "@/components/BlockBuilder.vue";
import DraggableItem from "@/components/DraggableItem.vue";
import type { TElement } from "@/types";
import ElementConfig from "@/components/ElementConfig.vue";
import Preview from "@/components/Preview.vue";
import InputUnit from "@/components/InputUnit.vue";
import { BaseElements } from "@/utils/constants";
import { useGeneralStore } from "@/stores/general";
import { storeToRefs } from "pinia";

const generalStore = useGeneralStore();
const {
  groupedVariables,
  currentTabElements,
  selectedElement,
  selectedTab,
  showGrid,
  variables,
  newVariable,
} = storeToRefs(generalStore);
const document = ref<TElement>(structuredClone(BaseElements[0]));

onMounted(() => {
  generalStore.handleSelectElement(document.value);
});
</script>

<template>
  <div class="p-2 box-border flex flex-col h-screen gap-2 bg-amber-700">
    <div class="flex flex-col justify-between items-center bg-amber-950 p-2">
      <!-- <button @click="selectedBlock = null">Remove selected block</button> -->
      <ElementConfig />
    </div>

    <div class="flex gap-2 bg-amber-900 h-full p-2">
      <div class="h-full w-2/3 bg-amber-800 flex flex-col justify-between">
        <BlockBuilder v-model="document" :show-close="false" :drop-prev="false" />
        <Preview v-if="false" :document="document" />
      </div>
      <div class="h-full w-1/3 overflow-y-auto">
        <div
          class="flex flex-col items-start justify-start gap-2 bg-amber-200 p-2 w-full"
        >
          <div
            class="h-full flex justify-between w-full sticky top-[0.5rem] overflow-x-auto"
          >
            <button
              class="text-white px-4 py-2 w-full"
              :class="[selectedTab === 'components' ? 'bg-amber-700' : 'bg-amber-500']"
              @click="selectedTab = 'components'"
            >
              Components
            </button>
            <button
              class="text-white px-4 py-2 w-full"
              :class="[selectedTab === 'elements' ? 'bg-amber-700' : 'bg-amber-500']"
              @click="selectedTab = 'elements'"
            >
              Elements
            </button>
            <button
              class="text-white px-4 py-2 w-full"
              :class="[selectedTab === 'blocks' ? 'bg-amber-700' : 'bg-amber-500']"
              @click="selectedTab = 'blocks'"
            >
              Blocks
            </button>
            <button
              class="text-white px-4 py-2 w-full"
              :class="[selectedTab === 'variables' ? 'bg-amber-700' : 'bg-amber-500']"
              @click="selectedTab = 'variables'"
            >
              Variables
            </button>
          </div>
          <div class="flex gap-2 ml-auto justify-start items-center">
            <label class="text-black" for="showGrid">Show grid</label>
            <input type="checkbox" v-model="showGrid" id="showGrid" />
          </div>

          <div class="flex flex-wrap gap-2 text-black">
            <DraggableItem
              v-if="['elements', 'blocks', 'components'].includes(selectedTab)"
              class="grow"
              v-for="element of currentTabElements"
              :key="element.id"
              :text="element.text"
              :meta="element"
            />

            <div
              v-if="selectedTab === 'variables'"
              class="text-black flex flex-col gap-2"
            >
              <form
                class="flex flex-col gap-2 mt-2 bg-amber-300 p-2"
                @submit.prevent="generalStore.handleAddVariable"
              >
                <h2 class="text-amber-700">Add variable</h2>
                <div class="flex gap-2">
                  <label>Group</label>
                  <select v-model="newVariable.group" required placeholder="Select group">
                    <option
                      v-for="group in Object.keys(groupedVariables)"
                      :key="group"
                      :value="group"
                    >
                      {{ group }}
                    </option>
                  </select>
                </div>
                <div class="flex gap-2">
                  <label>Name</label>
                  <input
                    type="text"
                    v-model="newVariable.name"
                    required
                    placeholder="Enter name"
                  />
                </div>
                <div class="flex gap-2">
                  <label>Value</label>
                  <input
                    v-if="newVariable.group === 'colors'"
                    type="color"
                    v-model="newVariable.value"
                    required
                    placeholder="Enter value"
                  />
                  <InputUnit
                    v-else
                    v-model="newVariable.value"
                    placeholder="Enter value"
                  />
                </div>
                <button class="bg-amber-700 text-white px-4 py-2">Add</button>
              </form>
              <div
                v-for="group in Object.values(groupedVariables)"
                :key="group.group"
                class="border-2 border-amber-700 p-2 flex flex-col gap-2"
              >
                <h4 class="uppercase">{{ group.group }}</h4>
                <div class="grid grid-cols-2 gap-1">
                  <div v-for="variable of group.variables" :key="variable.name">
                    <span class="mr-2">{{ variable.name }}:</span>
                    <input
                      v-if="group.group === 'colors'"
                      type="color"
                      v-model="variables[`--${group.group}-${variable.name}`]"
                    />
                    <InputUnit
                      v-else
                      v-model="variables[`--${group.group}-${variable.name}`]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
