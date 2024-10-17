import { defineStore } from "pinia";
import { ref } from "vue";

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

  return { currentClickSession, isNodeSelected };
});
