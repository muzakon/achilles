<template>
  <div
    ref="toolbarSection"
    class="absolute top-5 transform -translate-x-1/2 left-1/2 z-[9999] bg-[#202020] p-1 rounded-full justify-center border border-white/10"
    v-if="props.selected"
  >
    <div class="relative flex items-center">
      <div
        class="p-2 rounded-full flex items-center justify-center hover:text-purple-500 cursor-pointer hover:bg-neutral-900"
        :class="{
          'text-purple-500 bg-neutral-900': item.id === selectedItem,
          'mr-1': index !== menuItems.length - 1,
        }"
        v-for="(item, index) in menuItems"
        v-tooltip.bottom="item.title"
        @click="selectTool(index)"
      >
        <span class="material-symbols-outlined text-[24px]">
          {{ item.icon }}
        </span>
      </div>
      <Divider layout="vertical" />
      <div
        class="p-2 rounded-full flex items-center justify-center hover:text-purple-500 cursor-pointer hover:bg-neutral-900"
        :class="{
          'mr-1': index !== menuButtons.length - 1,
        }"
        v-for="(item, index) in menuButtons"
        v-tooltip.bottom="item.title"
      >
        <span class="material-symbols-outlined text-[24px]">
          {{ item.icon }}
        </span>
      </div>

      <BrushOptions :selected-tool="selectedItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import _ from "lodash";
import Divider from "primevue/divider";
import BrushOptions from "./BrushOptions.vue";

const props = defineProps<{
  selected: boolean;
}>();
const menuItems = ref([
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
    icon: "cached",
    title: "Vary Image",
  },
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
const selectedItem: Ref<string | null> = ref(null);
const toolbarSection: Ref<HTMLDivElement | null> = ref(null);

const emit = defineEmits<{
  (e: "change", tool: string): void;
}>();

function selectTool(index: number) {
  selectedItem.value = null;
  selectedItem.value = menuItems.value[index].id;
  emit("change", selectedItem.value);
}
// watch(
//   () => vueFlow.getViewport(),
//   (newValue, oldValue) => {
//     if (oldValue.zoom !== newValue.zoom && toolbarSection.value) {
//       toolbarSection.value.style.zoom = `${1 / newValue.zoom}`;
//     }
//   },
//   { deep: true }
// );
</script>

<style lang="less"></style>
