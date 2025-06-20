<script setup lang="ts">
import { computed, ref } from "vue";

type TType = "%" | "px" | "rem" | "em" | "vh" | "vw" | "vmin" | "vmax" | "";
type TSize = string;

defineProps<{
  placeholder?: string;
}>();

const model = defineModel<string>({ required: true });
const size = computed<TSize>({
  get() {
    const { numeric } = parseCSSValue(model.value);

    return String(numeric || "");
  },
  set(value) {
    model.value = value ? `${value}${type.value}` : "";
  },
});
const type = computed<TType>({
  get() {
    const { unit, numeric } = parseCSSValue(model.value);

    if (!numeric) return "px";
    return (unit || "px") as TType;
  },
  set(value) {
    model.value = `${size.value}${value}`;
  },
});

function parseCSSValue(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)?(.*)$/);

  if (!match) {
    return { numeric: null, unit: null };
  }

  return {
    numeric: match[1] ? parseFloat(match[1]) : null,
    unit: match[2] || null,
  };
}
</script>

<template>
  <div class="flex gap-2 w-full">
    <input type="text" v-model="size" class="w-full grow" :placeholder="placeholder" />
    <select v-model="type" class="w-min" :disabled="!size">
      <option value="%">%</option>
      <option value="px">PX</option>
      <option value="rem">REM</option>
      <option value="em">EM</option>
      <option value="vh">VH</option>
      <option value="vw">VW</option>
      <option value="vmin">VMIN</option>
      <option value="vmax">VMAX</option>
    </select>
  </div>
</template>
