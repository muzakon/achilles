<template>
  <div class="w-full h-full">
    <Sidebar />
    <Toolbar
      :selected="canvasStore.isNodeSelected"
      @change="handleOnSelectedToolChange"
    />

    <Brush />

    <div
      class="w-full h-full"
      @mousemove="updateBrushPosition"
      :class="{
        'cursor-none': brushOptionsStore.brushOptions.mode
          ? ['draw', 'draw-mask', 'eraser'].includes(
              brushOptionsStore.brushOptions.mode
            )
          : false,
      }"
    >
      <VueFlow
        v-model:nodes="nodes"
        :snap-to-grid="true"
        :snap-grid="[20, 20]"
        @mousemove="onCanvasMouseMove"
        @mouseup="onCanvasMouseUp"
        :zoom-on-double-click="false"
        :max-zoom="3"
        :min-zoom="1"
        :zoom-on-pinch="false"
        :zoom-on-scroll="false"
        @viewport-change-end="handleOnViewportChangeFinish"
        :pan-on-drag="brushOptionsStore.brushOptions.mode === 'drag-pan'"
      >
        <PromptSection />

        <Background color="#ffffff40" :gap="40" :size="2" />
        <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
        <template #node-canvas="specialNodeProps">
          <CanvasNode
            :mouse-position="{
              x: canvasStore.currentClickSession.currentMouseX,
              y: canvasStore.currentClickSession.currentMouseY,
            }"
            v-bind="specialNodeProps"
            :selected-tool="brushOptionsStore.brushOptions.mode"
          />
        </template>
      </VueFlow>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useVueFlow, VueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { useCanvasStore } from "@/stores/canvas";
import { useBrushOptionsStore } from "@/stores/brush";

import Toolbar from "@/components/Toolbar.vue";
import PromptSection from "@/components/PromptSection.vue";
import Sidebar from "@/components/Sidebar.vue";

import CanvasNode from "@/components/CanvasNode.vue";
import Brush from "@/components/Brush.vue";

const selectedTool: Ref<string | null> = ref(null);

// Store
const canvasStore = useCanvasStore();
const brushOptionsStore = useBrushOptionsStore();
const vueFlow = useVueFlow();

function onCanvasMouseMove($event: MouseEvent) {
  canvasStore.currentClickSession.currentMouseX = $event.clientX;
  canvasStore.currentClickSession.currentMouseY = $event.clientY;

  // if (canvasStore.currentClickSession.isResizing) {
  //   console.log(canvasStore.currentClickSession);
  // }
}

function onCanvasMouseUp($event: MouseEvent) {
  if (canvasStore.currentClickSession.isResizing) {
    canvasStore.currentClickSession.isResizing = false;
    setTimeout(() => {
      nodes.value[0].selected = true;
    }, 1);
  }
}

function handleOnSelectedToolChange(tool: string) {
  selectedTool.value = tool;
}

const nodes = ref([
  {
    id: "base",
    position: { x: 250, y: 5 },
    // all nodes can have a data object containing any data you want to pass to the node
    // a label can property can be used for default nodes
    data: { label: "Node 1" },
    type: "canvas",
    selected: false,
  },
]);

function handleOnViewportChangeFinish() {
  // return;

  const viewport = vueFlow.getViewport();
  brushOptionsStore.brushOptions.zoom = viewport.zoom;
}

function updateBrushPosition($event: MouseEvent) {
  brushOptionsStore.brushPosition.x = $event.clientX;
  brushOptionsStore.brushPosition.y = $event.clientY;
}
</script>

<style scoped></style>
