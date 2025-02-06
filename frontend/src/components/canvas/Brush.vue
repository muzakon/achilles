<template>
  <div
    id="__brush"
    ref="brush"
    class="absolute z-[9] border-2 rounded-full border-dashed border-black transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    :style="{
      width: getBrushOptions.size + 'px',
      height: getBrushOptions.size + 'px',
      left: getBrushPosition.x + 'px',
      top: getBrushPosition.y + 'px',
      scale: getBrushOptions.zoom,
    }"
  />
</template>

<script setup lang="ts">
import { useBrushOptionsStore } from "@/stores/brush";
const { getBrushOptions, getBrushPosition } = useBrushOptionsStore();
</script>

<style scoped></style>
