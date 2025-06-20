<script setup lang="ts">
import InputUnit from "@/components/InputUnit.vue";

const model = defineModel<string | undefined>({ required: true });
</script>

<template>
  <InputUnit property-type="color" v-model="model" v-slot="{ model, updateModel }">
    <input
      class="w-full"
      type="color"
      :style="{ backgroundColor: model }"
      :value="model"
      @input="updateModel(($event.target as HTMLInputElement)?.value)"
    />
  </InputUnit>
</template>
