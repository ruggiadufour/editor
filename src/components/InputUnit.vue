<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { TVariableGroup } from "@/types";
import { useGeneralStore } from "@/stores/general";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

type TType = "%" | "px" | "rem" | "em" | "vh" | "vw" | "vmin" | "vmax" | "";
type TSize = string;
type TPropertyType =
  | "width"
  | "height"
  | "padding"
  | "margin"
  | "fontSize"
  | "borderRadius"
  | "textAlign"
  | "fontWeight"
  | "display"
  | "flexDirection"
  | "gap"
  | "flexWrap"
  | "justifyContent"
  | "alignItems"
  | "gridTemplateColumns"
  | "gridTemplateRows";
const propertyTypesConfig: Record<
  TPropertyType,
  {
    nonUnitOptions: { value: string; text: string }[];
    variableGroups: TVariableGroup[];
    nonUnit?: boolean;
  }
> = {
  width: {
    nonUnitOptions: [
      { value: "auto", text: "Auto" },
      { value: "fit-content", text: "Fit content" },
      { value: "max-content", text: "Max content" },
      { value: "min-content", text: "Min content" },
    ],
    variableGroups: ["spacing"],
  },
  height: {
    nonUnitOptions: [
      { value: "auto", text: "Auto" },
      { value: "fit-content", text: "Fit content" },
      { value: "max-content", text: "Max content" },
      { value: "min-content", text: "Min content" },
    ],
    variableGroups: ["spacing"],
  },
  padding: { nonUnitOptions: [], variableGroups: ["spacing"] },
  margin: { nonUnitOptions: [], variableGroups: ["spacing"] },
  fontSize: {
    nonUnitOptions: [
      { value: "large", text: "Large" },
      { value: "medium", text: "Medium" },
      { value: "small", text: "Small" },
      { value: "x-large", text: "X-large" },
      { value: "x-small", text: "X-small" },
      { value: "xx-large", text: "XX-large" },
      { value: "xx-small", text: "XX-small" },
      { value: "xxx-large", text: "XXX-large" },
      { value: "larger", text: "Larger" },
      { value: "smaller", text: "Smaller" },
    ],
    variableGroups: ["spacing"],
  },
  borderRadius: { nonUnitOptions: [], variableGroups: ["radius"] },
  textAlign: {
    nonUnit: true,
    nonUnitOptions: [
      { value: "left", text: "Left" },
      { value: "center", text: "Center" },
      { value: "right", text: "Right" },
    ],
    variableGroups: [],
  },
  fontWeight: {
    nonUnit: true,
    nonUnitOptions: [
      { value: "normal", text: "Normal" },
      { value: "bold", text: "Bold" },
      { value: "lighter", text: "Lighter" },
      { value: "bolder", text: "Bolder" },
    ],
    variableGroups: [],
  },
  display: {
    nonUnit: true,
    nonUnitOptions: [
      { value: "flex", text: "Flex" },
      { value: "grid", text: "Grid" },
      { value: "block", text: "Block" },
      { value: "inline", text: "Inline" },
      { value: "inline-block", text: "Inline block" },
      { value: "none", text: "None" },
    ],
    variableGroups: [],
  },
  flexDirection: {
    nonUnit: true,
    nonUnitOptions: [
      { value: "row", text: "Row" },
      { value: "column", text: "Column" },
    ],
    variableGroups: [],
  },
  gap: { nonUnitOptions: [], variableGroups: ["spacing"] },
  flexWrap: {
    nonUnit: true,
    nonUnitOptions: [
      { value: "wrap", text: "Wrap" },
      { value: "nowrap", text: "No wrap" },
    ],
    variableGroups: [],
  },
  justifyContent: {
    nonUnit: true,
    nonUnitOptions: [
      { value: "flex-start", text: "Flex start" },
      { value: "flex-end", text: "Flex end" },
      { value: "center", text: "Center" },
      { value: "space-between", text: "Space between" },
      { value: "space-around", text: "Space around" },
    ],
    variableGroups: [],
  },
  alignItems: {
    nonUnit: true,
    nonUnitOptions: [
      { value: "flex-start", text: "Flex start" },
      { value: "flex-end", text: "Flex end" },
      { value: "center", text: "Center" },
      { value: "stretch", text: "Stretch" },
    ],
    variableGroups: [],
  },
  gridTemplateColumns: {
    nonUnit: true,
    nonUnitOptions: [
      { value: "repeat(1, 1fr)", text: "1 column" },
      { value: "repeat(2, 1fr)", text: "2 columns" },
      { value: "repeat(3, 1fr)", text: "3 columns" },
      { value: "repeat(4, 1fr)", text: "4 columns" },
      { value: "repeat(5, 1fr)", text: "5 columns" },
      { value: "repeat(6, 1fr)", text: "6 columns" },
      { value: "repeat(7, 1fr)", text: "7 columns" },
      { value: "repeat(8, 1fr)", text: "8 columns" },
    ],
    variableGroups: [],
  },
  gridTemplateRows: {
    nonUnit: true,
    nonUnitOptions: [
      { value: "repeat(1, 1fr)", text: "1 row" },
      { value: "repeat(2, 1fr)", text: "2 rows" },
      { value: "repeat(3, 1fr)", text: "3 rows" },
      { value: "repeat(4, 1fr)", text: "4 rows" },
      { value: "repeat(5, 1fr)", text: "5 rows" },
      { value: "repeat(6, 1fr)", text: "6 rows" },
      { value: "repeat(7, 1fr)", text: "7 rows" },
    ],
    variableGroups: [],
  },
};

const unitOptions: { value: TType; text: string }[] = [
  { value: "%", text: "%" },
  { value: "px", text: "PX" },
  { value: "rem", text: "REM" },
  { value: "em", text: "EM" },
  { value: "vh", text: "VH" },
  { value: "vw", text: "VW" },
  { value: "vmin", text: "VMIN" },
  { value: "vmax", text: "VMAX" },
];

const { placeholder, propertyType } = defineProps<{
  placeholder?: string;
  propertyType: TPropertyType;
}>();

const model = defineModel<string | number | undefined>({ required: true });
const generalStore = useGeneralStore();
const { groupedVariables } = storeToRefs(generalStore);
const isVariable = ref(false);

const configProperty = computed(() => propertyTypesConfig[propertyType]);
const size = computed<TSize>({
  get() {
    const { numeric, unit } = parseCSSValue(model.value);

    if (configProperty.value.nonUnitOptions.some((option) => option.value === unit)) {
      return unit || "";
    }

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
    if (configProperty.value.nonUnitOptions.some((option) => option.value === value)) {
      model.value = value;
    } else {
      model.value = `${size.value}${value}`;
    }
  },
});

function parseCSSValue(value: string | number | undefined = "") {
  const match = String(value || "").match(/^(\d+(?:\.\d+)?)?(.*)$/);

  if (!match) {
    return { numeric: null, unit: null };
  }

  return {
    numeric: match[1] ? parseFloat(match[1]) : null,
    unit: match[2] || null,
  };
}

const setIsVariable = () => {
  isVariable.value =
    (!!configProperty.value.variableGroups.length &&
      model.value?.toString().includes("var")) ??
    false;
};

watch(model, () => {
  setIsVariable();
});

onMounted(() => {
  setIsVariable();
});
</script>

<template>
  <div class="relative flex flex-col gap-2 w-full group">
    <div
      v-if="!configProperty.nonUnit"
      class="absolute top-full right-0 flex-col gap-2 bg-amber-100 p-2 box-border w-full group-hover:flex hidden z-10"
    >
      <select
        v-if="configProperty.variableGroups.length"
        v-model="isVariable"
        class="grow w-full"
        placeholder="Type of value"
      >
        <option :value="false">Custom value</option>
        <option :value="true">Variable</option>
      </select>

      <select v-if="!isVariable && !configProperty.nonUnit" v-model="type" class="">
        <optgroup label="Units">
          <option
            v-for="unit in unitOptions"
            :key="unit.value"
            :value="unit.value"
            :disabled="!size"
          >
            {{ unit.text }}
          </option>
        </optgroup>
        <optgroup v-if="configProperty.nonUnitOptions.length" label="Non-unit ">
          <option
            v-for="option in configProperty.nonUnitOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </optgroup>
      </select>
    </div>

    <select
      v-if="isVariable && configProperty.variableGroups.length"
      v-model="model"
      class="w-full"
      :placeholder="placeholder"
    >
      <optgroup
        v-for="variableGroup in configProperty.variableGroups"
        :key="variableGroup"
        :label="groupedVariables[variableGroup].group.toUpperCase()"
      >
        <option
          v-for="variable in groupedVariables[variableGroup].variables"
          :key="variable.name"
          :value="`var(${variable.key})`"
        >
          {{ variable.name }} ({{ variable.value }})
        </option>
      </optgroup>
    </select>
    <select v-else-if="configProperty.nonUnit" v-model="type" class="">
      <optgroup v-if="!configProperty.nonUnit" label="Units">
        <option
          v-for="unit in unitOptions"
          :key="unit.value"
          :value="unit.value"
          :disabled="!size"
        >
          {{ unit.text }}
        </option>
      </optgroup>
      <optgroup v-if="configProperty.nonUnitOptions.length" label="Non-unit ">
        <option
          v-for="option in configProperty.nonUnitOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.text }}
        </option>
      </optgroup>
    </select>
    <input v-else class="w-full" type="text" v-model="size" :placeholder="placeholder" />
  </div>
</template>
