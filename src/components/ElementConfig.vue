<script setup lang="ts">
import { ref, watch } from "vue";
import type { TElement } from "@/types";
import { useGeneralStore } from "@/stores/general";
import { storeToRefs } from "pinia";
import InputUnit from "@/components/InputUnit.vue";
import ConfigLabel from "@/components/ConfigLabel.vue";
import InputColor from "@/components/InputColor.vue";

const emit = defineEmits<{
  (e: "update", element: TElement): void;
}>();

const generalStore = useGeneralStore();
const { selectedElement } = storeToRefs(generalStore);
const name = ref("");

const handleAddProp = () => {
  if (!selectedElement.value) return;
  selectedElement.value.meta.props[name.value] = "";
  name.value = "";
};

const handleRemoveProp = (prop: string) => {
  if (!selectedElement.value) return;
  delete selectedElement.value.meta.props[prop];
};
</script>

<template>
  <div
    v-if="selectedElement"
    class="p-4 bg-amber-200 text-amber-950 shadow max-h-[500px] w-full overflow-y-auto"
  >
    <div v-if="selectedElement.meta.isComponent" class="flex flex-col">
      <h3 class="text-lg font-bold mb-4">Configuración de Componente</h3>
      <h4>Propiedades</h4>
      <div v-for="(prop, index) in Object.keys(selectedElement.meta.props)" :key="index">
        <label class="block text-sm font-medium text-gray-700"
          >{{ prop }}
          <button
            class="bg-amber-700 text-white px-4 py-2 rounded-md"
            @click="handleRemoveProp(prop)"
          >
            Remove
          </button>
        </label>
      </div>
      <div class="">
        <label class="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          v-model="name"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          class="bg-amber-700 text-white px-4 py-2 rounded-md w-full mt-2"
          @click="handleAddProp"
        >
          Agregar
        </button>
      </div>
    </div>

    <h3 class="text-lg font-bold mb-4">Configuración de Estilos</h3>

    <div class="flex flex-wrap gap-2 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Texto</label>
        <textarea
          v-if="selectedElement.type === 'paragraph'"
          v-model="selectedElement.text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
        <input
          v-else
          v-model="selectedElement.text"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div v-if="selectedElement.type === 'link'">
        <label class="block text-sm font-medium text-gray-700">Source (URL)</label>
        <input
          v-model="selectedElement.properties.href"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div v-if="selectedElement.type === 'image'">
        <label class="block text-sm font-medium text-gray-700">Source (URL)</label>
        <input
          v-model="selectedElement.properties.src"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div v-if="selectedElement.type === 'heading'">
        <label class="block text-sm font-medium text-gray-700">Type</label>
        <select
          v-model="selectedElement.meta.tag"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="h1">Title H1</option>
          <option value="h2">Title H2</option>
          <option value="h3">Title H3</option>
          <option value="h4">Title H4</option>
          <option value="h5">Title H5</option>
          <option value="h6">Title H6</option>
        </select>
      </div>

      <ConfigLabel label="Color de texto">
        <InputColor v-model="selectedElement.styles.color" />
      </ConfigLabel>

      <ConfigLabel label="Color de fondo">
        <InputColor v-model="selectedElement.styles.backgroundColor" />
      </ConfigLabel>

      <ConfigLabel label="Height">
        <InputUnit v-model="selectedElement.styles.height" property-type="height" />
      </ConfigLabel>
      <ConfigLabel label="Minimum height">
        <InputUnit v-model="selectedElement.styles.minHeight" property-type="height" />
      </ConfigLabel>

      <ConfigLabel label="Width">
        <InputUnit v-model="selectedElement.styles.width" property-type="width" />
      </ConfigLabel>

      <ConfigLabel label="Minimum width">
        <InputUnit v-model="selectedElement.styles.minWidth" property-type="width" />
      </ConfigLabel>

      <ConfigLabel label="Padding">
        <InputUnit v-model="selectedElement.styles.padding" property-type="padding" />
      </ConfigLabel>

      <ConfigLabel label="Margin">
        <InputUnit v-model="selectedElement.styles.margin" property-type="margin" />
      </ConfigLabel>

      <ConfigLabel label="Font size">
        <InputUnit v-model="selectedElement.styles.fontSize" property-type="fontSize" />
      </ConfigLabel>

      <ConfigLabel label="Font weight">
        <InputUnit
          v-model="selectedElement.styles.fontWeight"
          property-type="fontWeight"
        />
      </ConfigLabel>

      <ConfigLabel label="Border radius">
        <InputUnit
          v-model="selectedElement.styles.borderRadius"
          property-type="borderRadius"
        />
      </ConfigLabel>

      <ConfigLabel label="Text align">
        <InputUnit v-model="selectedElement.styles.textAlign" property-type="textAlign" />
      </ConfigLabel>

      <!-- Flex/grid -->
      <ConfigLabel label="Display">
        <InputUnit v-model="selectedElement.styles.display" property-type="display" />
      </ConfigLabel>

      <ConfigLabel
        v-if="selectedElement.styles.display === 'flex'"
        label="Flex direction"
      >
        <InputUnit
          v-model="selectedElement.styles.flexDirection"
          property-type="flexDirection"
        />
      </ConfigLabel>

      <ConfigLabel
        v-if="['flex', 'grid'].includes(selectedElement.styles.display || '')"
        label="Gap"
      >
        <InputUnit v-model="selectedElement.styles.gap" property-type="gap" />
      </ConfigLabel>

      <ConfigLabel v-if="selectedElement.styles.display === 'flex'" label="Flex wrap">
        <InputUnit v-model="selectedElement.styles.flexWrap" property-type="flexWrap" />
      </ConfigLabel>

      <ConfigLabel
        v-if="selectedElement.styles.display === 'flex'"
        label="Justify content"
      >
        <InputUnit
          v-model="selectedElement.styles.justifyContent"
          property-type="justifyContent"
        />
      </ConfigLabel>

      <ConfigLabel v-if="selectedElement.styles.display === 'flex'" label="Align items">
        <InputUnit
          v-model="selectedElement.styles.alignItems"
          property-type="alignItems"
        />
      </ConfigLabel>

      <!-- if grid -->
      <ConfigLabel
        v-if="selectedElement.styles.display === 'grid'"
        label="Grid template columns"
      >
        <InputUnit
          v-model="selectedElement.styles.gridTemplateColumns"
          property-type="gridTemplateColumns"
        />
      </ConfigLabel>

      <!-- if grid -->
      <ConfigLabel
        v-if="selectedElement.styles.display === 'grid'"
        label="Grid template rows"
      >
        <InputUnit
          v-model="selectedElement.styles.gridTemplateRows"
          property-type="gridTemplateRows"
        />
      </ConfigLabel>
    </div>
  </div>
</template>
