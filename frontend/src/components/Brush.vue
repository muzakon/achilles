<template>
  <div
    id="__brush"
    class="absolute z-[9] border-2 rounded-full border-dashed border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    ref="brush"
    v-if="
      brushOptionsStore.brushOptions.mode
        ? ['draw', 'draw-mask', 'eraser'].includes(
            brushOptionsStore.brushOptions.mode
          )
        : false
    "
    :style="{
      width: brushOptionsStore.brushOptions.size + 'px',
      height: brushOptionsStore.brushOptions.size + 'px',
      left: brushOptionsStore.brushPosition.x + 'px',
      top: brushOptionsStore.brushPosition.y + 'px',
      scale: brushOptionsStore.brushOptions.zoom,
    }"
  ></div>
</template>

<script setup lang="ts">
import { useBrushOptionsStore } from "@/stores/brush";
const brushOptionsStore = useBrushOptionsStore();
</script>

<style scoped></style>
