<template>
  <div class="absolute left-0 top-0 w-full h-full z-[10]">
    <canvas
      ref="canvas"
      @mousemove="onCanvasMouseMove"
      @mouseup="onCanvasMouseUp"
      @mousedown="onCanvasMouseDown"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from "vue";
import { useCanvasStore } from "@/stores/canvas";
import { useVueFlow } from "@vue-flow/core";
import { useBrushOptionsStore } from "@/stores/brush";
import { CanvasService } from "@/services/CanvasService";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const context: Ref<CanvasRenderingContext2D | null> = ref(null);
const canvasStore = useCanvasStore();
const brushOptionsStore = useBrushOptionsStore();

const vueFlow = useVueFlow();
const canvasService: Ref<CanvasService | null> = ref(null);

const props = defineProps<{
  selectedTool: string | null;
  position: Object;
}>();

function getImageCanvas(): HTMLCanvasElement | null {
  const canvas = document.getElementById("imageCanvas") as HTMLCanvasElement;
  return canvas ? canvas : null;
}

function setCanvasSize(width: number, height: number) {
  if (canvas.value) {
    canvas.value.style.width = `${width}px`;
    canvas.value.style.height = `${height}px`;
    canvas.value.width = width;
    canvas.value.height = height;

    const imageCanvas = getImageCanvas();
    if (imageCanvas) {
      canvasService.value = new CanvasService(canvas.value, imageCanvas);
      canvasService.value.selectedTool = props.selectedTool;
      canvasService.value.saveOriginalBackground();
    }
  }
}

function onCanvasMouseUp() {
  if (canvasService.value) {
    canvasService.value.onCanvasMouseUp();
  }
}

function onCanvasMouseDown() {
  if (canvasService.value) {
    canvasService.value.onCanvasMouseDown();
  }
}

function onCanvasMouseMove($event: MouseEvent) {
  if (canvasService.value) {
    canvasService.value.onCanvasMouseMove(
      $event,
      props.position.x,
      props.position.y,
      vueFlow.getViewport().x,
      vueFlow.getViewport().y,
      brushOptionsStore.brushOptions.size,
      brushOptionsStore.brushOptions.color
    );
  }
}

watch(
  () => canvasStore.canvasSize,
  (newValue) => {
    setCanvasSize(newValue.width, newValue.height);
  },
  {
    deep: true,
  }
);

watch(
  () => props.selectedTool,
  (newValue) => {
    if (canvasService.value && newValue) {
      canvasService.value.selectedTool = newValue;
    }
  }
);

onMounted(async () => {
  if (canvas.value) {
    context.value = canvas.value.getContext("2d");
  }
});
</script>

<style scoped></style>
