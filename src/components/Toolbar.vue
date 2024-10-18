<template>
  <div
    ref="toolbarSection"
    class="fixed top-1/2 transform -translate-y-1/2 left-5 z-[11] bg-[#0a0a0a] flex items-center p-1 rounded-full justify-center border border-white/10 flex-col"
  >
    <div
      class="p-1 rounded-full flex items-center justify-center hover:text-purple-500 cursor-pointer"
      :class="{
        'text-purple-400': index === selectedItem,
        'mr-1': index !== menuItems.length - 1,
      }"
      v-for="(item, index) in menuItems"
      v-tooltip.right="item.title"
      @click="selectedItem = index"
    >
      <span class="material-symbols-outlined text-[20px]">
        {{ item.icon }}
      </span>
    </div>
    <Divider layout="horizontal" />
    <div
      class="p-1 rounded-full flex items-center justify-center hover:text-purple-500 cursor-pointer"
      :class="{
        'mr-1': index !== menuButtons.length - 1,
      }"
      v-for="(item, index) in menuButtons"
      v-tooltip.right="item.title"
    >
      <span class="material-symbols-outlined text-[20px]">
        {{ item.icon }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from "vue";
import { useVueFlow } from "@vue-flow/core";
import _ from "lodash";
import Divider from "primevue/divider";

const props = defineProps<{
  selected: boolean;
}>();
const menuItems = ref([
  {
    icon: "stylus_note",
    title: "Draw",
  },
  {
    icon: "ink_eraser",
    title: "Eraser",
  },
  {
    icon: "filter_tilt_shift",
    title: "Draw Mask",
  },
  {
    icon: "cached",
    title: "Vary Image",
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
const selectedItem: Ref<number | null> = ref(null);
const vueFlow = useVueFlow();
const toolbarSection: Ref<HTMLDivElement | null> = ref(null);

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
