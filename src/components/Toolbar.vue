<template>
  <div
    ref="toolbarSection"
    class="absolute top-[-60px] right-0 z-[11] bg-[#0a0a0a] flex items-center p-1 rounded-full justify-center border border-white/10"
    v-if="props.selected"
  >
    <div
      class="p-1 rounded-full flex items-center justify-center hover:text-purple-500 cursor-pointer"
      :class="{
        'text-purple-400': index === selectedItem,
        'mr-1': index !== menuItems.length - 1,
      }"
      v-for="(item, index) in menuItems"
      v-tooltip.bottom="item.title"
      @click="selectedItem = index"
    >
      <span class="material-symbols-outlined text-[20px]">
        {{ item.icon }}
      </span>
    </div>
    <Divider layout="vertical" />
    <div
      class="p-1 rounded-full flex items-center justify-center hover:text-purple-500 cursor-pointer"
      :class="{
        'mr-1': index !== menuButtons.length - 1,
      }"
      v-for="(item, index) in menuButtons"
      v-tooltip.bottom="item.title"
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

watch(
  () => vueFlow.getViewport(),
  (newValue, oldValue) => {
    if (oldValue.zoom !== newValue.zoom && toolbarSection.value) {
      toolbarSection.value.style.zoom = `${1 / newValue.zoom}`;
    }
  },
  { deep: true }
);
</script>

<style lang="less"></style>
