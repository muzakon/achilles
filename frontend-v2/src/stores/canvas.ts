import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useCanvasStore = defineStore("canvas", () => {
  const currentClickSession = ref({
    originX: 0,
    originY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
    isDrawing: false,
    isResizing: false,
  });
  const isNodeSelected = ref(false);
  const canvasSize = ref({
    width: 0,
    height: 0,
  });
  const currentCanvasImage: Ref<string | null> = ref(null);

  function setCurrentCanvasImage(image: string) {
    currentCanvasImage.value = image;
  }

  return {
    currentClickSession,
    isNodeSelected,
    canvasSize,
    currentCanvasImage,
    setCurrentCanvasImage,
  };
});
