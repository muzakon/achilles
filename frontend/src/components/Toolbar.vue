<template>
  <div>
    <div
      ref="toolbarSection"
      class="absolute top-5 transform -translate-x-1/2 left-1/2 z-[9999] bg-white p-1 rounded-full justify-center border border-white/10"
    >
      <div class="relative flex items-center">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="p-2 rounded-full flex items-center justify-center hover:text-neutral-900 cursor-pointer hover:bg-neutral-200 transition duration-200"
          :class="{
            '!text-neutral-900 bg-neutral-200':
              item.id === brushOptionsStore.getCurrentBrushMode,
            'text-neutral-400':
              item.id !== brushOptionsStore.getCurrentBrushMode,
            'mr-1': index !== menuItems.length - 1,
          }"
          @click="selectTool(item.id)"
        >
          <span class="material-symbols-outlined text-[24px]">
            {{ item.icon }}
          </span>
        </div>

        <v-divider
          class="mx-3 border-gray-700"
          vertical
          color="grey-darken-4"
          :thickness="1"
        />

        <div
          v-for="(item, index) in menuButtons"
          :key="index"
          class="p-2 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 cursor-pointer hover:bg-neutral-200 transition duration-200"
          :class="{
            'mr-1': index !== menuButtons.length - 1,
          }"
        >
          <span class="material-symbols-outlined text-[24px]">
            {{ item.icon }}
          </span>
        </div>
      </div>
    </div>

    <div
      class="absolute top-5 left-5 z-[9999] bg-white p-1 rounded-full border border-white/10"
    >
      <ToolbarMenu :selected-tool="brushOptionsStore.brushOptions.mode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref } from "vue";
import { useVueFlow } from "@vue-flow/core";
import { useBrushOptionsStore } from "@/stores/brush";
import {
  type BrushMode,
  type MenuButton,
  type MenuItem,
} from "@/interfaces/Toolbar";

// Store for managing brush options globally (reactive store).
const brushOptionsStore = useBrushOptionsStore();
const { setBrushOptions } = brushOptionsStore;

// Menu items for different tools and their associated icons and titles.
const menuItems: Ref<MenuItem[]> = ref([
  { icon: "drag_pan", title: "Drag Pan", id: "drag-pan", showMenu: false },
  { icon: "stylus_note", title: "Draw", id: "draw", showMenu: false },
  { icon: "ink_eraser", title: "Eraser", id: "eraser", showMenu: false },
  {
    icon: "filter_tilt_shift",
    title: "Draw Mask",
    id: "draw-mask",
    showMenu: false,
  },
]);

// Button items for additional actions like downloading, adding to favorites, etc.
const menuButtons: Ref<MenuButton[]> = ref([
  { icon: "download", title: "Download" },
  { icon: "favorite", title: "Add to favorites" },
  { icon: "bookmarks", title: "Add to collection" },
]);

// Reference to the toolbar section DOM element (optional use in the template).
const toolbarSection: Ref<HTMLDivElement | null> = ref(null);

// Initialize the Vue Flow instance for managing the flow chart or diagram.
const vueFlow = useVueFlow();

const menuPersistent = ref(false);

/**
 * Function to handle tool selection and update the associated properties.
 * This updates the node's selectable and draggable properties based on the selected tool.
 *
 * @param {BrushMode} value - The selected brush mode (tool).
 */
function selectTool(value: BrushMode): void {
  // Retrieve the base node from Vue Flow to modify its properties based on the selected tool.
  const node = vueFlow.findNode("base");
  setBrushOptions({
    ...brushOptionsStore.getBrushOptions,
    mode: value,
  });

  if (node) {
    // Adjust the node's properties based on the selected brush mode.
    switch (brushOptionsStore.getCurrentBrushMode) {
      case "drag-pan":
        node.selectable = true;
        node.draggable = true;
        console.log("test");
        break;
      case "draw":
      case "eraser":
      case "draw-mask":
        node.selectable = false;
        node.draggable = false;
        node.selected = false;
        console.log("test");
        break;
      default:
        break;
    }
  }
}
</script>

<style lang="scss"></style>
