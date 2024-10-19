<template>
  <div class="w-full h-full">
    <Sidebar />
    <Toolbar :selected="canvasStore.isNodeSelected" />

    <VueFlow
      v-model:nodes="nodes"
      :snap-to-grid="true"
      :snap-grid="[20, 20]"
      @mousemove="onCanvasMouseMove"
      @mouseup="onCanvasMouseUp"
      :zoom-on-double-click="false"
      :max-zoom="3"
      :min-zoom="1"
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

import Toolbar from "@/components/Toolbar.vue";
import PromptSection from "@/components/PromptSection.vue";
import Sidebar from "@/components/Sidebar.vue";

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
