// Import stores
import { useBrushOptionsStore } from "@/stores/brush";
import { useCanvasStore } from "@/stores/canvas";

// Brush modes constants
const BRUSH_MODES = ["draw", "eraser", "draw-mask"];

// Define Stores
const brushOptionsStore = useBrushOptionsStore();
const canvasStore = useCanvasStore();

const { setBrushVisibility } = brushOptionsStore;
const { setCurrentClickSession } = canvasStore;

// VueFlow Service Class
/**
 * A service class to handle interactions with the VueFlow canvas.
 * This includes mouse events and viewport changes, as well as interacting with
 * the brush options and canvas stores.
 */
export class VueFlowService {
  /**
   * Handles the mouse leaving the canvas area.
   * This hides the brush when the mouse leaves the canvas.
   */
  static onCanvasMouseLeave() {
    const { setBrushVisibility } = useBrushOptionsStore();
    setBrushVisibility(false);
  }

  /**
   * Handles the mouse entering the canvas area.
   * If the current brush mode is drawing, erasing, or drawing a mask,
   * it shows the brush; otherwise, it hides the brush.
   */
  static onCanvasMouseEnter() {
    const mode = brushOptionsStore.getCurrentBrushMode;

    // Show brush if drawing-related mode, else hide brush
    const shouldShowBrush = BRUSH_MODES.includes(mode);
    setBrushVisibility(shouldShowBrush);
  }

  /**
   * Handles mouse movement events on the canvas.
   * Updates the current mouse coordinates in the canvas store.
   *
   * @param {MouseEvent} event - The mouse event containing client coordinates.
   */
  static onCanvasMouseMove(event: MouseEvent) {
    setCurrentClickSession({
      ...canvasStore.currentClickSession,
      currentMouseX: event.clientX,
      currentMouseY: event.clientY,
    });
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  /**
   * Handles the mouse up event after a resize action.
   * Marks resizing as complete and selects the first node.
   *
   * @param {any} nodes - The nodes collection, used to select a node after resizing.
   */
  static onCanvasMouseUp(nodes: any) {
    if (canvasStore.currentClickSession.isResizing) {
      setCurrentClickSession({
        ...canvasStore.currentClickSession,
        isResizing: false,
      });

      // Select the first node after resizing completes
      setTimeout(() => {
        nodes.value[0].selected = true;
      }, 1);
    }
  }

  // /**
  //  * Handles the completion of a viewport change in VueFlow.
  //  * Updates the zoom level in the brush options store.
  //  */
  // static handleOnViewportChangeFinish() {
  //   const viewport = this.vueFlow.getViewport();
  //   this.brushOptionsStore.brushOptions.zoom = viewport.zoom;
  // }
}
