<script setup lang="ts">
import type { TElement } from "@/types";

defineProps<{
  element: TElement;
}>();
</script>

<template>
  <div>
    <h1>{{ element.text }}</h1>
  </div>
</template>
