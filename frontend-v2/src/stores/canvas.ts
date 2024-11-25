import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

// Interface representing a session of mouse interaction on the canvas (click, drawing, resizing).
interface CurrentClickSession {
  originX: number;  // X coordinate where the interaction started (e.g., mouse down position).
  originY: number;  // Y coordinate where the interaction started.
  currentMouseX: number;  // Current mouse X coordinate.
  currentMouseY: number;  // Current mouse Y coordinate.
  isDrawing: boolean;  // Flag indicating if drawing is in progress.
  isResizing: boolean;  // Flag indicating if resizing is in progress.
}

/**
 * Pinia store for managing canvas state and interactions.
 */
export const useCanvasStore = defineStore("canvas", () => {
  // Track the current mouse interaction session on the canvas.
  const currentClickSession: Ref<CurrentClickSession> = ref({
    originX: 0,
    originY: 0,
    currentMouseX: 0,
    currentMouseY: 0,
    isDrawing: false,
    isResizing: false,
  });

  // Boolean flag to track whether a node is selected on the canvas.
  const isNodeSelected = ref(false);

  // Size of the canvas, used to manage layout and rendering.
  const canvasSize = ref({
    width: 0,
    height: 0,
  });

  // Optional image data for the canvas (could be the data URL of an image or null).
  const currentCanvasImage: Ref<string | null> = ref(null);

  /**
   * Set a new image to be displayed on the canvas.
   * @param image - The image URL or data string to be set.
   */
  function setCurrentCanvasImage(image: string) {
    currentCanvasImage.value = image;
  }

  /**
   * Update the current mouse interaction session with new data.
   * @param session - The new session object containing interaction details.
   */
  function setCurrentClickSession(session: CurrentClickSession) {
    currentClickSession.value = session;
  }

  // Return all state variables and setters so they can be used in components.
  return {
    currentClickSession,
    isNodeSelected,
    canvasSize,
    currentCanvasImage,
    setCurrentCanvasImage,
    setCurrentClickSession,
  };
});
