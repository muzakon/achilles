export type BrushMode = "drag-pan" | "draw" | "draw-mask" | "eraser";

// Interface for a single menu item (tool)
export interface MenuItem {
  icon: string; // Icon identifier (e.g., 'drag_pan', 'stylus_note', etc.)
  title: string; // Title of the menu item (e.g., 'Drag Pan', 'Draw', etc.)
  id: BrushMode; // Unique identifier for the menu item (e.g., 'drag-pan', 'draw', etc.)
  showMenu: boolean
}

// Interface for a single menu button (action like download, add to favorites, etc.)
export interface MenuButton {
  icon: string; // Icon identifier (e.g., 'download', 'favorite', etc.)
  title: string; // Title of the menu button (e.g., 'Download', 'Add to favorites', etc.)
}


export interface BrushStoreOption {
  size: number;
  color: string;
  mode: BrushMode;
  visible: boolean;
  zoom: number;
}

export interface BrushStorePosition {
  x: number;
  y: number;
}