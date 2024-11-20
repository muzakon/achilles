import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

interface BrushOption {
  size: number;
  color: string | null;
  mode: string | null;
  visible: boolean;
  zoom: number
}

interface BrushPosition {
  x: number;
  y: number;
}

export const useBrushOptionsStore = defineStore("brushOptions", () => {
  const brushOptions: Ref<BrushOption> = ref({
    size: 16,
    color: "#FFFFFF",
    mode: "drag-pan",
    visible: false,
    zoom: 1
  });

  const brushPosition: Ref<BrushPosition> = ref({
    x: 0,
    y: 0,
  });

  return { brushOptions, brushPosition };
});
