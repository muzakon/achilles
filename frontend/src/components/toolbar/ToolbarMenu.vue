<template>
  <div
    class="absolute left-0 top-0 bg-white border p-4 w-[240px] rounded-[5px]"
    v-if="props.selectedTool !== 'drag-pan'"
  >
    <DrawToolMenu v-if="props.selectedTool === 'draw'" />
    <EraserToolMenu v-else-if="props.selectedTool === 'eraser'" />
    <DrawMaskToolMenu v-else-if="props.selectedTool === 'draw-mask'" />
  </div>
</template>

<script setup lang="ts">
import type { BrushMode } from "@/interfaces/Toolbar";
import EraserToolMenu from "./EraserToolMenu.vue";

const props = defineProps<{
  selectedTool: BrushMode;
}>();
</script>

<style scoped></style>
