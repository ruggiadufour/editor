<script setup lang="ts">
const handleDragStart = (e: DragEvent) => {
  console.log(e);
  e.dataTransfer?.setData("application/json", JSON.stringify({ test: 1 }));
};

const handleDrop = (e: DragEvent) => {
  const data = e.dataTransfer?.getData("application/json");
  console.log(data, typeof data);
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};
</script>

<template>
  <div class="p-2 box-border flex h-screen">
    <div class="flex items-center justify-center gap-2 bg-amber-200 w-full h-full">
      <span class="p-4 bg-amber-500" draggable="true" @dragstart="handleDragStart"
        >hola</span
      >
      <span class="p-4 bg-amber-500" draggable="true">hola</span>
      <span class="p-4 bg-amber-500" draggable="true">hola</span>
    </div>
    <div
      class="flex items-center justify-center gap-2 bg-amber-100 w-full"
      @drop="handleDrop"
      @dragover="handleDragOver"
    >
      <span>adios</span>
    </div>
  </div>
</template>
