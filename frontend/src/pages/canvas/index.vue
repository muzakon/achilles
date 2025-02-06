<template>
  <div class="w-full h-full">
    <!-- <Sidebar /> -->
    <Brush v-if="brushOptionsStore.isBrushVisible" />
    <Toolbar :selected="canvasStore.isNodeSelected" />

    <div
      class="w-full h-full"
      :class="{
        'cursor-none': brushOptionsStore.isBrushVisible,
      }"
      @mousemove="updateBrushPosition"
    >
      <VueFlow
        v-model:nodes="nodes"
        :snap-to-grid="true"
        :snap-grid="[20, 20]"
        :zoom-on-double-click="false"
        :max-zoom="3"
        :min-zoom="1"
        :zoom-on-pinch="false"
        :zoom-on-scroll="false"
        :pan-on-drag="brushOptionsStore.brushOptions.mode === 'drag-pan'"
        @mousemove="VueFlowService.onCanvasMouseMove"
        @mouseup="VueFlowService.onCanvasMouseUp(nodes)"
        @mouseenter="VueFlowService.onCanvasMouseEnter"
        @mouseleave="VueFlowService.onCanvasMouseLeave"
      >
        <Background pattern-color="#00000035" :gap="40" :size="3" />
        <template #node-canvas="specialNodeProps">
          <CanvasNode
            :mouse-position="{
              x: canvasStore.currentClickSession.currentMouseX,
              y: canvasStore.currentClickSession.currentMouseY,
            }"
            :canvas-image="canvasStore.currentCanvasImage"
            v-bind="specialNodeProps"
            :selected-tool="brushOptionsStore.brushOptions.mode"
          />
        </template>
      </VueFlow>

      <PromptSection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { useCanvasStore } from "@/stores/canvas";
import { useBrushOptionsStore } from "@/stores/brush";

import Toolbar from "@/components/Toolbar.vue";
import Brush from "@/components/canvas/Brush.vue";
import PromptSection from "@/components/canvas/PromptSection.vue";
//   import Sidebar from "@/components/Sidebar.vue";
//   import CanvasNode from "@/components/CanvasNode.vue";

// Services
import { VueFlowService } from "@/services/helper/VueFlowHelperService";

// Store
const canvasStore = useCanvasStore();
const brushOptionsStore = useBrushOptionsStore();
const vueFlowStore = useVueFlow();

vueFlowStore.onInit(() => {
  vueFlowStore.fitView({
    maxZoom: 1,
    minZoom: 1,
  });
  console.log("Vue Flow successfully loaded.");
});

const nodes = ref([
  {
    id: "base",
    position: { x: 250, y: 5 },
    data: { label: "Node 1" },
    selected: false,
    type: "canvas",
  },
]);

function updateBrushPosition($event: MouseEvent) {
  brushOptionsStore.brushPosition.x = $event.clientX;
  brushOptionsStore.brushPosition.y = $event.clientY;
}
</script>

<style scoped></style>
