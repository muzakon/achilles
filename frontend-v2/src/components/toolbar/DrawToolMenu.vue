<template>
  <div class="p-4">
    <div>
      <h1 class="font-bold uppercase text-[11px] mb-2 text-neutral-500">
        Draw
      </h1>
      <div
        class="rounded-full h-[28px] w-[28px] inline-flex justify-center items-center cursor-pointer hover:bg-neutral-200 mr-0.5 mb-0.5 transition duration-200"
        v-for="(color, index) in commonColors"
        :key="index"
        :class="{
          'bg-neutral-200': brushStore.brushOptions.color === color,
        }"
        @click="selectColor(color)"
      >
        <span
          class="min-h-[12px] min-w-[12px] rounded-full inline-block border border-neutral-100"
          :style="{
            background: color,
          }"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { commonColors } from "@/helper/Constants";
import { useBrushOptionsStore } from "@/stores/brush";

const brushStore = useBrushOptionsStore();
const { setBrushOptions } = brushStore;

function selectColor(color: string) {
  setBrushOptions({ ...brushStore.getBrushOptions, color: color });
}
</script>

<style scoped></style>
