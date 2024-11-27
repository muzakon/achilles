<template>
  <div
    class="absolute left-0 top-0 bg-white border p-4 w-[240px] rounded-[5px]"
  >
    <DrawToolMenu v-if="props.selectedTool === 'draw'" />
  </div>
</template>

<script setup lang="ts">
import type { BrushMode } from "@/interfaces/Toolbar";

const props = defineProps<{
  selectedTool: BrushMode;
}>();
</script>

<style scoped></style>
