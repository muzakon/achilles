<template>
  <div class="w-full h-full">
    <VueFlow
      v-model:nodes="nodes"
      :snap-to-grid="true"
      :snap-grid="[20, 20]"
      @mousemove="onCanvasMouseMove"
      @mouseup="onCanvasMouseUp"
      :zoom-on-double-click="false"
      :max-zoom="2"
      :min-zoom="0.8"
      :fit-view-on-init="true"
    >
      <Background color="#404040" />
      <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
      <template #node-canvas="specialNodeProps">
        <CanvasNode
          :mouse-position="{
            x: canvasStore.currentClickSession.currentMouseX,
            y: canvasStore.currentClickSession.currentMouseY,
          }"
          v-bind="specialNodeProps"
        />
      </template>
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { VueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { useCanvasStore } from "@/stores/canvas";

import CanvasNode from "@/components/CanvasNode.vue";

// Store
const canvasStore = useCanvasStore();

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

const nodes = ref([
  {
    id: "1",
    position: { x: 250, y: 5 },
    // all nodes can have a data object containing any data you want to pass to the node
    // a label can property can be used for default nodes
    data: { label: "Node 1" },
    type: "canvas",
    selected: false,
  },
]);
</script>

<style scoped></style>
