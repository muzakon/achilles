<template>
  <div class="absolute left-0 top-0 w-full h-full z-[9]">
    <canvas id="imageCanvas" ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { type Ref, ref, onMounted, watch } from "vue";
import { useCanvasStore } from "@/stores/canvas";

const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const context: Ref<CanvasRenderingContext2D | null> = ref(null);
const canvasStore = useCanvasStore();

const props = defineProps<{
  selectedTool: string;
  canvasImage: string | null;
}>();

function setCanvasSize(width: number, height: number) {
  if (canvas.value) {
    canvas.value.style.width = `${width}px`;
    canvas.value.style.height = `${height}px`;
    canvas.value.width = width;
    canvas.value.height = height;
  }
}

function drawCanvasImage(image: HTMLImageElement) {
  if (context.value) {
    context.value.drawImage(image, 0, 0, image.width, image.height);
  }
}

function setCanvasImage(url: string) {
  const defaultImage = new Image();
  defaultImage.src = url;
  // defaultImage.setAttribute("crossOrigin", "");

  defaultImage.onload = () => {
    const width = defaultImage.width;
    const height = defaultImage.height;

    useCanvasStore().canvasSize = { width, height };
    setCanvasSize(
      useCanvasStore().canvasSize.width,
      useCanvasStore().canvasSize.height
    );
    drawCanvasImage(defaultImage);
  };
}

onMounted(() => {
  if (canvas.value) {
    context.value = canvas.value.getContext("2d");
    if (context.value) {
      context.value.imageSmoothingEnabled = false;
      context.value.imageSmoothingQuality = "high";
    }
  }
});

watch(
  () => props.canvasImage,
  (newValue: any) => {
    if (newValue) {
      setCanvasImage(newValue);
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped></style>
