import { defineStore } from "pinia";
import { ref, computed, type Ref } from "vue";
import {
  type BrushStoreOption,
  type BrushStorePosition,
} from "@/interfaces/Toolbar";

/**
 * Pinia store to manage brush options and state for a drawing application or toolbar.
 * Stores brush settings like size, color, visibility, and current position.
 */
export const useBrushOptionsStore = defineStore("brushOptions", () => {
  // Reactive reference to store the brush settings
  const brushOptions: Ref<BrushStoreOption> = ref({
    size: 16, // Default brush size
    color: "#FFFFFF", // Default brush color (white)
    mode: "drag-pan", // Brush interaction mode (e.g., pan, draw, etc.)
    visible: false, // Brush visibility flag
    zoom: 1, // Brush zoom level (scale)
  });

  // Reactive reference to store the brush position
  const brushPosition: Ref<BrushStorePosition> = ref({
    x: 0, // Initial X position of the brush
    y: 0, // Initial Y position of the brush
  });

  // Reactive reference for tracking brush visibility separately from other brush options
  const isBrushVisible = ref(false);

  /**
   * Sets the visibility of the brush.
   * @param value - Boolean value to toggle brush visibility.
   */
  function setBrushVisibility(value: boolean) {
    isBrushVisible.value = value;
  }

  /**
   * Sets the brushOptions value of the store.
   * @param value - Value of type BrushStoreOption.
   */
  function setBrushOptions(value: BrushStoreOption) {
    brushOptions.value = value;
  }

  // Computed property to get the current brush mode (e.g., "drag-pan", "draw", etc.)
  const getCurrentBrushMode = computed(() => brushOptions.value.mode);

  // Computed property to get all the current brush settings/options
  const getBrushOptions = computed(() => brushOptions.value);

  // Computed property to get the current brush position (x, y coordinates)
  const getBrushPosition = computed(() => brushPosition.value);

  // Return all reactive properties and methods for use in components
  return {
    brushOptions,
    brushPosition,
    isBrushVisible,
    getCurrentBrushMode,
    getBrushOptions,
    getBrushPosition,
    setBrushVisibility,
    setBrushOptions,
  };
});
