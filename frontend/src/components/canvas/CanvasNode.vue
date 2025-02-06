<template>
  <div>
    <div
      v-if="canvasStore.isNodeSelected"
      ref="resizeOverlay"
      class="resizeOverlay absolute z-[-1]"
    />

    <div
      ref="canvasContainer"
      class="bg-neutral-300 relative canvasContainer transition duration-200"
      :class="{
        '!cursor-none': ['draw', 'draw-mask', 'eraser'].includes(
          brushOptionsStore.getCurrentBrushMode
        ),
        'hover:scale-[1.01]': !props.canvasImage,
      }"
      :selected="canvasStore.isNodeSelected"
    >
      <div v-if="canvasStore.isNodeSelected && canvasImage">
        <div
          id="__left_top_selector"
          className="w-[24px] h-[24px]  rounded-full absolute left-[-11px] top-[-11px] hover:bg-[#d946ef40] transition duration-200 cursor-nwse-resize z-[20]"
          @mousedown="onEdgeMouseDown($event, 'top-left')"
        >
          <div
            className="w-[6px] h-[6px] bg-pink-500 border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          />
        </div>

        <div
          id="__right_top_selector"
          className="w-[24px] h-[24px]  rounded-full absolute right-[-11px] top-[-11px] hover:bg-[#d946ef40] transition duration-200 cursor-nesw-resize	z-[20]"
        >
          <div
            className="w-[6px] h-[6px] bg-pink-500 border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          />
        </div>

        <div
          id="__left_bottom_selector"
          className="w-[24px] h-[24px]  rounded-full absolute left-[-11px] bottom-[-11px] hover:bg-[#d946ef40] transition duration-200 cursor-nesw-resize z-[20]"
        >
          <div
            className="w-[6px] h-[6px] bg-pink-500 border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          />
        </div>

        <div
          id="__right_bottom_selector"
          className="w-[24px] h-[24px]  rounded-full absolute right-[-11px] bottom-[-11px] hover:bg-[#d946ef40] transition duration-200 cursor-nwse-resize z-[20]"
        >
          <div
            className="w-[6px] h-[6px] bg-pink-500 border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          />
        </div>

        <div
          id="__top_center_selector"
          className="w-[24px] h-[24px]  rounded-full absolute top-[-11px] left-1/2 hover:bg-[#d946ef40] transition duration-200 transform -translate-x-1/2 cursor-ns-resize	z-[20]"
        >
          <div
            className="w-[6px] h-[6px] bg-pink-500 border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          />
        </div>

        <div
          id="__bottom_center_selector"
          className="w-[24px] h-[24px]  rounded-full absolute bottom-[-11px] left-1/2 hover:bg-[#d946ef40] transition duration-200 transform -translate-x-1/2 cursor-ns-resize	z-[20]"
        >
          <div
            className="w-[6px] h-[6px] bg-pink-500 border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          />
        </div>

        <div
          id="__left_center_selector"
          className="w-[24px] h-[24px]  rounded-full absolute top-1/2 left-[-11px] hover:bg-[#d946ef40] transition duration-200 transform -translate-y-1/2 cursor-ew-resize	z-[20]"
        >
          <div
            className="w-[6px] h-[6px] bg-pink-500 border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          />
        </div>

        <div
          id="__right_center_selector"
          className="w-[24px] h-[24px]  rounded-full absolute top-1/2 right-[-11px] hover:bg-[#d946ef40] transition duration-200 transform -translate-y-1/2 cursor-ew-resize	z-[20]"
        >
          <div
            className="w-[6px] h-[6px] bg-pink-500 border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          />
        </div>
      </div>

      <div v-if="canvasImage" class="relative">
        <DrawCanvas
          :position="position"
          :selected-tool="brushOptionsStore.getCurrentBrushMode"
        />
        <ImageCanvas
          :position="position"
          :selected-tool="brushOptionsStore.getCurrentBrushMode"
          :canvas-image="canvasImage"
        />
        <MaskImage :canvas-image="canvasImage" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref, watch } from "vue";
import { useCanvasStore } from "@/stores/canvas";
import { useVueFlow } from "@vue-flow/core";
import _ from "lodash";

import DrawCanvas from "./DrawCanvas.vue";
import ImageCanvas from "./ImageCanvas.vue";
import MaskImage from "./MaskImage.vue";
import { useBrushOptionsStore } from "@/stores/brush";

const canvasContainer: Ref<HTMLDivElement | null> = ref(null);
const resizeOverlay: Ref<HTMLDivElement | null> = ref(null);

const brushOptionsStore = useBrushOptionsStore();
const canvasStore = useCanvasStore();
const vueFlow = useVueFlow();

const props = defineProps<{
  mousePosition: {
    x: number;
    y: number;
  };
  position: object;
  selected: boolean;
  canvasImage: string | null;
}>();

function onEdgeMouseDown($event: MouseEvent, position: string) {
  $event.stopPropagation();
  if (!canvasStore.currentClickSession.isResizing) {
    canvasStore.currentClickSession.isResizing = true;
    canvasStore.currentClickSession.originX = $event.clientX;
    canvasStore.currentClickSession.originY = $event.clientY;

    if (position == "top-left") {
      const positions = position.split("-");
      setResizeOverlayPosition(positions[0], positions[1]);
    }
  }
}

function setCanvasContainerSize(width: number, height: number) {
  if (canvasContainer.value) {
    canvasContainer.value.style.width = `${width}px`;
    canvasContainer.value.style.height = `${height}px`;
  }
}

function setResizeOverlaySize(width: number, height: number) {
  if (resizeOverlay.value) {
    resizeOverlay.value.style.width = `${width}px`;
    resizeOverlay.value.style.height = `${height}px`;
  }
}

function setResizeOverlayPosition(
  verticalPosition: string,
  horizontalPosition: string
) {
  if (resizeOverlay.value) {
    if (verticalPosition === "top") {
      resizeOverlay.value.style.bottom = `${0}px`;
    }

    if (horizontalPosition === "left") {
      resizeOverlay.value.style.right = `${0}px`;
    }
  }
}

function getCurrentCanvasContainerSize() {
  if (canvasContainer.value) {
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;

    return {
      width,
      height,
    };
  }

  return null;
}

watch(
  () => canvasStore.canvasSize,
  (newValue) => {
    setCanvasContainerSize(newValue.width, newValue.height);
    setResizeOverlaySize(newValue.width, newValue.height);
  },
  {
    deep: true,
  }
);

watch(
  () => props.mousePosition,
  (newValue) => {
    if (canvasStore.currentClickSession.isResizing) {
      const originX = canvasStore.currentClickSession.originX;
      const originY = canvasStore.currentClickSession.originY;

      const divider = 10;
      const newWidth =
        newValue.x >= originX
          ? 0
          : Math.abs(Math.round(newValue.x / divider) * divider - originX) /
            vueFlow.getViewport().zoom;
      const newHeight =
        newValue.y >= originY
          ? 0
          : Math.abs(Math.round(newValue.y / divider) * divider - originY) /
            vueFlow.getViewport().zoom;

      const currentCanvasSize = getCurrentCanvasContainerSize();

      if (currentCanvasSize) {
        const finalWidth = currentCanvasSize.width + newWidth;
        const finalHeight = currentCanvasSize.height + newHeight;

        setResizeOverlaySize(finalWidth, finalHeight);
      }
    }
  },
  {
    deep: true,
  }
);

watch(
  () => props.selected,
  _.debounce((newValue: boolean) => {
    canvasStore.isNodeSelected = newValue;
  }, 2)
);

onMounted(() => {
  setCanvasContainerSize(
    canvasStore.canvasSize.width,
    canvasStore.canvasSize.height
  );
  setResizeOverlaySize(
    canvasStore.canvasSize.width,
    canvasStore.canvasSize.height
  );
});
</script>

<style lang="scss" scoped>
.resizeOverlay {
  border: 1px dotted #d946ef;
  background: linear-gradient(
    135deg,
    #d946ef40 10%,
    #0000 0,
    #0000 50%,
    #d946ef40 0,
    #d946ef40 60%,
    #0000 0,
    #0000
  );
  background-size: 7.07px 7.07px;
  background-color: #79bbf91a;
}

.canvasContainer {
  &[selected="false"] {
    &::after {
      display: none !important;
    }
  }
  &::after {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: 1px dashed #d946ef;
    content: "";
    z-index: 15;
  }
}
</style>
