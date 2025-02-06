<template>
  <div
    class="absolute w-full transform -translate-x-1/2 left-1/2 z-[1] bg-[#202020] p-3 rounded-[10px] border border-white/10 min-h-[80px]"
    :class="{
      'bottom-[-90px]': brushOptionsStore.brushOptions.mode
        ? ['eraser', 'draw-mask'].includes(brushOptionsStore.brushOptions.mode)
        : false,
      'bottom-[-167px]': brushOptionsStore.brushOptions.mode
        ? ['draw'].includes(brushOptionsStore.brushOptions.mode)
        : false,
    }"
    v-if="brushOptionsStore.brushOptions.visible"
  >
    <div class="w-full">
      <div class="flex items-center justify-between">
        <span class="text-[11px] text-white/40"> Brush Size </span>
        <span
          class="material-symbols-outlined text-[14px] text-white/40 hover:text-white cursor-pointer"
          @click="brushOptionsStore.brushOptions.visible = false"
        >
          close
        </span>
      </div>

      <div class="mt-2 px-0 flex items-center">
        <div>
          <InputGroup>
            <InputNumber
              :min="1"
              :max="512"
              style="width: 80px"
              v-model="brushOptionsStore.brushOptions.size"
            />
            <InputGroupAddon>px</InputGroupAddon>
          </InputGroup>
        </div>
        <div class="w-full ml-4">
          <Slider
            v-model="brushOptionsStore.brushOptions.size"
            :min="1"
            :max="512"
          />
        </div>
      </div>

      <div class="mt-4" v-if="brushOptionsStore.brushOptions.mode === 'draw'">
        <div class="w-full">
          <div class="w-full text-[11px] text-white/40">Color</div>

          <div class="mt-2">
            <div
              v-for="color in colors"
              class="w-[16px] h-[16px] inline-block rounded-full mr-2 border-2 cursor-pointer"
              :class="{
                'border-white/0':
                  brushOptionsStore.brushOptions.color !== color,
                'border-white': brushOptionsStore.brushOptions.color === color,
              }"
              @click="brushOptionsStore.brushOptions.color = color"
              :style="{ backgroundColor: `${color}` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useBrushOptionsStore } from "@/stores/brush";

import Slider from "primevue/slider";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";

const props = defineProps<{
  selectedTool: string | null;
}>();

const colors = ref([
  "#FF6F61", // Soft Red
  "#6BFF6B", // Soft Green
  "#6B8FFF", // Soft Blue
  "#FFF68F", // Soft Yellow
  "#FF6F92", // Soft Magenta
  "#6BFFF6", // Soft Cyan
  "#B0B0B0", // Soft Gray
  "#FFFFFF", // White
  "#D3D3D3", // Light Gray
  "#FFB74D", // Soft Orange
  "#A75CB6", // Soft Purple
  "#FFB2C1", // Soft Pink
  "#C69C6D", // Soft Brown
  "#FFEA00", // Soft Gold
  "#66B3A8", // Soft Dark Green
  "#4C6EB5", // Soft Navy
]);

const brushOptionsStore = useBrushOptionsStore();

watch(
  () => props.selectedTool,
  (newValue) => {
    brushOptionsStore.brushOptions.mode = newValue;
    if (newValue !== "drag-pan") {
      brushOptionsStore.brushOptions.visible = true;
    } else {
      brushOptionsStore.brushOptions.visible = false;
    }
  }
);
</script>

<style scoped></style>
