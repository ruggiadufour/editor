<script setup lang="ts">
const handleDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData("application/json", JSON.stringify({ test: 1 }));
};
</script>

<template>
  <div class="p-4 bg-amber-500" draggable="true" @dragstart="handleDragStart">hola</div>
</template>
