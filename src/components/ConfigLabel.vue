<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <slot />
  </div>
</template>
