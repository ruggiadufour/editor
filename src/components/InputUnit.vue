<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { TVariableGroup } from "@/types";
import { useGeneralStore } from "@/stores/general";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

type TType = "%" | "px" | "rem" | "em" | "vh" | "vw" | "vmin" | "vmax" | "";
type TSize = string;
type TPropertyType =
  | "general"
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
  | "gridTemplateRows"
  | "color";
const propertyTypesConfig: Record<
  TPropertyType,
  {
    nonUnitOptions: { value: string; text: string }[];
    variableGroups: TVariableGroup[];
    nonUnit?: boolean;
  }
> = {
  general: { nonUnitOptions: [], variableGroups: [] },
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
  color: {
    nonUnitOptions: [
      { value: "aliceblue", text: "Alice blue" },
      { value: "antiquewhite", text: "Antique white" },
      { value: "aqua", text: "Aqua" },
      { value: "aquamarine", text: "Aquamarine" },
      { value: "azure", text: "Azure" },
      { value: "beige", text: "Beige" },
      { value: "bisque", text: "Bisque" },
      { value: "black", text: "Black" },
      { value: "blanchedalmond", text: "Blanched almond" },
      { value: "blue", text: "Blue" },
      { value: "blueviolet", text: "Blue violet" },
      { value: "brown", text: "Brown" },
      { value: "burlywood", text: "Burlywood" },
      { value: "cadetblue", text: "Cadet blue" },
      { value: "chartreuse", text: "Chartreuse" },
      { value: "chocolate", text: "Chocolate" },
      { value: "coral", text: "Coral" },
      { value: "cornflowerblue", text: "Cornflower blue" },
      { value: "cornsilk", text: "Cornsilk" },
      { value: "crimson", text: "Crimson" },
      { value: "cyan", text: "Cyan" },
      { value: "darkblue", text: "Dark blue" },
      { value: "darkcyan", text: "Dark cyan" },
      { value: "darkgoldenrod", text: "Dark goldenrod" },
      { value: "darkgray", text: "Dark gray" },
      { value: "darkgreen", text: "Dark green" },
      { value: "darkgrey", text: "Dark grey" },
      { value: "darkkhaki", text: "Dark khaki" },
      { value: "darkmagenta", text: "Dark magenta" },
      { value: "darkolivegreen", text: "Dark olive green" },
      { value: "darkorange", text: "Dark orange" },
      { value: "darkorchid", text: "Dark orchid" },
      { value: "darkred", text: "Dark red" },
      { value: "darksalmon", text: "Dark salmon" },
      { value: "darkseagreen", text: "Dark sea green" },
      { value: "darkslateblue", text: "Dark slate blue" },
      { value: "darkslategray", text: "Dark slate gray" },
      { value: "darkslategrey", text: "Dark slate grey" },
      { value: "darkturquoise", text: "Dark turquoise" },
      { value: "darkviolet", text: "Dark violet" },
      { value: "deeppink", text: "Deep pink" },
      { value: "deepskyblue", text: "Deep sky blue" },
      { value: "dimgray", text: "Dim gray" },
      { value: "dimgrey", text: "Dim grey" },
      { value: "dodgerblue", text: "Dodger blue" },
      { value: "firebrick", text: "Fire brick" },
      { value: "floralwhite", text: "Floral white" },
      { value: "forestgreen", text: "Forest green" },
      { value: "fuchsia", text: "Fuchsia" },
      { value: "gainsboro", text: "Gainsboro" },
      { value: "ghostwhite", text: "Ghost white" },
      { value: "gold", text: "Gold" },
      { value: "goldenrod", text: "Goldenrod" },
      { value: "gray", text: "Gray" },
      { value: "green", text: "Green" },
      { value: "greenyellow", text: "Green yellow" },
      { value: "grey", text: "Grey" },
      { value: "honeydew", text: "Honeydew" },
      { value: "hotpink", text: "Hot pink" },
      { value: "indianred", text: "Indian red" },
      { value: "indigo", text: "Indigo" },
      { value: "ivory", text: "Ivory" },
      { value: "khaki", text: "Khaki" },
      { value: "lavender", text: "Lavender" },
      { value: "lavenderblush", text: "Lavender blush" },
      { value: "lawngreen", text: "Lawngreen" },
      { value: "lemonchiffon", text: "Lemon chiffon" },
      { value: "lightblue", text: "Light blue" },
      { value: "lightcoral", text: "Light coral" },
      { value: "lightcyan", text: "Light cyan" },
      { value: "lightgoldenrodyellow", text: "Light goldenrod yellow" },
      { value: "lightgray", text: "Light gray" },
      { value: "lightgreen", text: "Light green" },
      { value: "lightgrey", text: "Light grey" },
      { value: "lightpink", text: "Light pink" },
      { value: "lightsalmon", text: "Light salmon" },
      { value: "lightseagreen", text: "Light sea green" },
      { value: "lightskyblue", text: "Light sky blue" },
      { value: "lightslategray", text: "Light slate gray" },
      { value: "lightslategrey", text: "Light slate grey" },
      { value: "lightsteelblue", text: "Light steel blue" },
      { value: "lightyellow", text: "Light yellow" },
      { value: "lime", text: "Lime" },
      { value: "limegreen", text: "Lime green" },
      { value: "linen", text: "Linen" },
      { value: "magenta", text: "Magenta" },
      { value: "maroon", text: "Maroon" },
      { value: "mediumaquamarine", text: "Medium aquamarine" },
      { value: "mediumblue", text: "Medium blue" },
      { value: "mediumorchid", text: "Medium orchid" },
      { value: "mediumpurple", text: "Medium purple" },
      { value: "mediumseagreen", text: "Medium sea green" },
      { value: "mediumslateblue", text: "Medium slate blue" },
      { value: "mediumspringgreen", text: "Medium spring green" },
      { value: "mediumturquoise", text: "Medium turquoise" },
      { value: "mediumvioletred", text: "Medium violet red" },
      { value: "midnightblue", text: "Midnight blue" },
      { value: "mintcream", text: "Mint cream" },
      { value: "mistyrose", text: "Misty rose" },
      { value: "moccasin", text: "Moccasin" },
      { value: "navajowhite", text: "Navajo white" },
      { value: "navy", text: "Navy" },
      { value: "oldlace", text: "Old lace" },
      { value: "olive", text: "Olive" },
      { value: "olivedrab", text: "Olive drab" },
      { value: "orange", text: "Orange" },
      { value: "orangered", text: "Orange red" },
      { value: "orchid", text: "Orchid" },
      { value: "palegoldenrod", text: "Pale goldenrod" },
      { value: "palegreen", text: "Pale green" },
      { value: "paleturquoise", text: "Pale turquoise" },
      { value: "palevioletred", text: "Pale violet red" },
      { value: "papayawhip", text: "Papaya whip" },
      { value: "peachpuff", text: "Peach puff" },
      { value: "peru", text: "Peru" },
      { value: "pink", text: "Pink" },
      { value: "plum", text: "Plum" },
      { value: "powderblue", text: "Powder blue" },
      { value: "purple", text: "Purple" },
      { value: "rebeccapurple", text: "Rebecca purple" },
      { value: "red", text: "Red" },
      { value: "rosybrown", text: "Rosy brown" },
      { value: "royalblue", text: "Royal blue" },
      { value: "saddlebrown", text: "Saddle brown" },
      { value: "salmon", text: "Salmon" },
      { value: "sandybrown", text: "Sandy brown" },
      { value: "seagreen", text: "Sea green" },
      { value: "seashell", text: "Seashell" },
      { value: "sienna", text: "Sienna" },
      { value: "silver", text: "Silver" },
      { value: "skyblue", text: "Sky blue" },
      { value: "slateblue", text: "Slate blue" },
      { value: "slategray", text: "Slate gray" },
      { value: "slategrey", text: "Slate grey" },
      { value: "snow", text: "Snow" },
      { value: "springgreen", text: "Spring green" },
      { value: "steelblue", text: "Steel blue" },
      { value: "tan", text: "Tan" },
      { value: "teal", text: "Teal" },
      { value: "thistle", text: "Thistle" },
      { value: "tomato", text: "Tomato" },
      { value: "transparent", text: "Transparent" },
      { value: "turquoise", text: "Turquoise" },
      { value: "violet", text: "Violet" },
      { value: "wheat", text: "Wheat" },
      { value: "white", text: "White" },
      { value: "whitesmoke", text: "Whitesmoke" },
      { value: "yellow", text: "Yellow" },
      { value: "yellowgreen", text: "Yellow green" },
    ],
    variableGroups: ["colors"],
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
      v-if="
        configProperty.variableGroups.length || (!isVariable && !configProperty.nonUnit)
      "
      class="absolute top-full right-0 flex-col gap-2 bg-amber-100 p-2 box-border w-fit group-hover:flex hidden z-10"
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
    <slot
      v-else
      :model="model"
      :size="size"
      :type="type"
      :update-model="(value: string | number | undefined) => model = value"
    >
      <input class="w-full" type="text" v-model="size" :placeholder="placeholder" />
    </slot>
  </div>
</template>
