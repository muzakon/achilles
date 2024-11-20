import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import image from "@/assets/images/1.jpeg";

export const useCanvasStore = defineStore("counter", () => {
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
  const currentCanvasImage: Ref<string | null> = ref(image)

  return { currentClickSession, isNodeSelected, canvasSize, currentCanvasImage };
});
