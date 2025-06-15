<script setup lang="ts">
import { ref, watch } from "vue";
import type { TElement } from "@/types";

const emit = defineEmits<{
  (e: "update", element: TElement): void;
}>();

const element = defineModel<TElement>({ required: true });
</script>

<template>
  <div class="p-4 bg-amber-200 text-amber-950 shadow max-h-[500px] overflow-y-auto">
    <h3 class="text-lg font-bold mb-4">Configuración de Estilos</h3>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Texto</label>
        <textarea
          v-if="element.type === 'paragraph'"
          v-model="element.text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
        <input
          v-else
          v-model="element.text"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div v-if="element.type === 'link'">
        <label class="block text-sm font-medium text-gray-700">Href</label>
        <input
          v-model="element.properties.href"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Color de texto</label>
        <input v-model="element.styles.color" type="color" class="mt-1 block w-full" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Color de fondo</label>
        <input
          v-model="element.styles.backgroundColor"
          type="color"
          class="mt-1 block w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Height</label>
        <input
          v-model="element.styles.height"
          type="text"
          placeholder="ej: 100px"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Width</label>
        <input
          v-model="element.styles.width"
          type="text"
          placeholder="ej: 100px"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Padding</label>
        <input
          v-model="element.styles.padding"
          type="text"
          placeholder="ej: 1rem"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Margen</label>
        <input
          v-model="element.styles.margin"
          type="text"
          placeholder="ej: 1rem"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Tamaño de fuente</label>
        <input
          v-model="element.styles.fontSize"
          type="text"
          placeholder="ej: 1.5rem"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Peso de fuente</label>
        <select
          v-model="element.styles.fontWeight"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Lighter</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Borde redondeado</label>
        <input
          v-model="element.styles.borderRadius"
          type="text"
          placeholder="ej: 0.5rem"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Alineación</label>
        <select
          v-model="element.styles.textAlign"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </select>
      </div>

      <!-- Flex/grid -->
      <div>
        <label class="block text-sm font-medium text-gray-700">Display</label>
        <select
          v-model="element.styles.display"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="flex">Flex</option>
          <option value="grid">Grid</option>
        </select>
      </div>

      <!-- if flex -->
      <div v-if="element.styles.display === 'flex'">
        <label class="block text-sm font-medium text-gray-700">Flex direction</label>
        <select
          v-model="element.styles.flexDirection"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="row">Row</option>
          <option value="column">Column</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Gap</label>
        <input
          v-model="element.styles.gap"
          type="text"
          placeholder="ej: 1rem"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div v-if="element.styles.display === 'flex'">
        <label class="block text-sm font-medium text-gray-700">Flex wrap</label>
        <select
          v-model="element.styles.flexWrap"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="wrap">Wrap</option>
          <option value="nowrap">No wrap</option>
        </select>
      </div>

      <!-- justify and align -->
      <div v-if="element.styles.display === 'flex'">
        <label class="block text-sm font-medium text-gray-700">Justify content</label>
        <select
          v-model="element.styles.justifyContent"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="flex-start">Flex start</option>
          <option value="flex-end">Flex end</option>
          <option value="center">Center</option>
          <option value="space-between">Space between</option>
          <option value="space-around">Space around</option>
        </select>
      </div>

      <div v-if="element.styles.display === 'flex'">
        <label class="block text-sm font-medium text-gray-700">Align items</label>
        <select
          v-model="element.styles.alignItems"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="flex-start">Flex start</option>
          <option value="flex-end">Flex end</option>
          <option value="center">Center</option>
        </select>
      </div>

      <!-- if grid -->
      <div v-if="element.styles.display === 'grid'">
        <label class="block text-sm font-medium text-gray-700"
          >Grid template columns</label
        >
        <select
          v-model="element.styles.gridTemplateColumns"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="1fr">1 column</option>
          <option value="repeat(2, 1fr)">2 columns</option>
          <option value="3fr">3 columns</option>
          <option value="repeat(4, 1fr)">4 columns</option>
          <option value="repeat(5, 1fr)">5 columns</option>
          <option value="repeat(6, 1fr)">6 columns</option>
          <option value="repeat(7, 1fr)">7 columns</option>
          <option value="repeat(8, 1fr)">8 columns</option>
        </select>
      </div>

      <!-- if grid -->
      <div v-if="element.styles.display === 'grid'">
        <label class="block text-sm font-medium text-gray-700">Grid template rows</label>
        <select
          v-model="element.styles.gridTemplateRows"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="repeat(1, 1fr)">1 row</option>
          <option value="repeat(2, 1fr)">2 rows</option>
          <option value="repeat(3, 1fr)">3 rows</option>
          <option value="repeat(4, 1fr)">4 rows</option>
          <option value="repeat(5, 1fr)">5 rows</option>
          <option value="repeat(6, 1fr)">6 rows</option>
          <option value="repeat(7, 1fr)">7 rows</option>
          <option value="repeat(8, 1fr)">8 rows</option>
        </select>
      </div>
    </div>
  </div>
</template>
