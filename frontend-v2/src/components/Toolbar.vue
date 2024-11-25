<template>
  <div
    ref="toolbarSection"
    class="absolute top-5 transform -translate-x-1/2 left-1/2 z-[9999] bg-white p-1 rounded-full justify-center border border-white/10"
  >
    <div class="relative flex items-center">
      <div
        class="p-2 rounded-full flex items-center justify-center hover:text-neutral-900 cursor-pointer hover:bg-neutral-200 transition duration-200"
        :class="{
          '!text-neutral-900 bg-neutral-200': item.id === selectedItem,
          'text-neutral-400': item.id !== selectedItem,
          'mr-1': index !== menuItems.length - 1,
        }"
        v-for="(item, index) in menuItems"
        @click="selectTool(item.id)"
      >
        <span class="material-symbols-outlined text-[24px]">
          {{ item.icon }}
        </span>
      </div>

      <v-divider
        class="mx-3 border-gray-400"
        vertical
        :thickness="1"
        color="grey-darken-4"
      ></v-divider>

      <div
        class="p-2 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 cursor-pointer hover:bg-neutral-200 transition duration-200"
        :class="{
          'mr-1': index !== menuButtons.length - 1,
        }"
        v-for="(item, index) in menuButtons"
      >
        <span class="material-symbols-outlined text-[24px]">
          {{ item.icon }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import _ from "lodash";
import { useVueFlow } from "@vue-flow/core";
import { useBrushOptionsStore } from "@/stores/brush";

const props = defineProps<{
  selected: boolean;
}>();
const brushOptionsStore = useBrushOptionsStore();
const menuItems = ref([
  {
    icon: "drag_pan",
    title: "Drag Pan",
    id: "drag-pan",
  },
  {
    icon: "stylus_note",
    title: "Draw",
    id: "draw",
  },
  {
    icon: "ink_eraser",
    title: "Eraser",
    id: "eraser",
  },
  {
    icon: "filter_tilt_shift",
    title: "Draw Mask",
    id: "draw-mask",
  },
]);

const menuButtons = ref([
  {
    icon: "download",
    title: "Download",
  },
  {
    icon: "favorite",
    title: "Add to favorites",
  },
  {
    icon: "bookmarks",
    title: "Add to collection",
  },
]);
const selectedItem: Ref<string | null> = ref("drag-pan");
const toolbarSection: Ref<HTMLDivElement | null> = ref(null);
const vueFlow = useVueFlow();

function selectTool(value: string) {
  selectedItem.value = value;

  // Update node selectable status depending on the selected tool.
  const node = vueFlow.findNode("base");

  if (node) {
    switch (selectedItem.value) {
      case "drag-pan":
        node.selectable = true;
        node.draggable = true;
        break;
      case "draw":
      case "eraser":
      case "draw-mask":
        node.selectable = false;
        node.draggable = false;
        node.selected = false;
        break;
      default:
        break;
    }

    brushOptionsStore.brushOptions.mode = selectedItem.value;
  }
}
</script>

<style lang="scss"></style>
