<template>
  <div>
    <div
      class="resizeOverlay absolute z-[-1]"
      ref="resizeOverlay"
      v-if="canvasStore.isNodeSelected"
    ></div>

    <div
      class="bg-neutral-950 relative canvasContainer"
      ref="canvasContainer"
      :selected="canvasStore.isNodeSelected"
    >
      <div v-if="canvasStore.isNodeSelected">
        <div
          @mousedown="onEdgeMouseDown($event, 'top-left')"
          id="__left_top_selector"
          className="w-[24px] h-[24px]  rounded-full absolute left-[-11px] top-[-11px] hover:bg-[#d946ef40] transition duration-200 cursor-nwse-resize z-[2]"
        >
          <div
            className="w-[6px] h-[6px] bg-[#0a0a0a] border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          ></div>
        </div>

        <div
          id="__right_top_selector"
          className="w-[24px] h-[24px]  rounded-full absolute right-[-11px] top-[-11px] hover:bg-[#d946ef40] transition duration-200 cursor-nesw-resize	z-[2]"
        >
          <div
            className="w-[6px] h-[6px] bg-[#0a0a0a] border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          ></div>
        </div>

        <div
          id="__left_bottom_selector"
          className="w-[24px] h-[24px]  rounded-full absolute left-[-11px] bottom-[-11px] hover:bg-[#d946ef40] transition duration-200 cursor-nesw-resize z-[2]"
        >
          <div
            className="w-[6px] h-[6px] bg-[#0a0a0a] border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          ></div>
        </div>

        <div
          id="__right_bottom_selector"
          className="w-[24px] h-[24px]  rounded-full absolute right-[-11px] bottom-[-11px] hover:bg-[#d946ef40] transition duration-200 cursor-nwse-resize z-[2]"
        >
          <div
            className="w-[6px] h-[6px] bg-[#0a0a0a] border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          ></div>
        </div>

        <div
          id="__top_center_selector"
          className="w-[24px] h-[24px]  rounded-full absolute top-[-11px] left-1/2 hover:bg-[#d946ef40] transition duration-200 transform -translate-x-1/2 cursor-ns-resize	z-[2]"
        >
          <div
            className="w-[6px] h-[6px] bg-[#0a0a0a] border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          ></div>
        </div>

        <div
          id="__bottom_center_selector"
          className="w-[24px] h-[24px]  rounded-full absolute bottom-[-11px] left-1/2 hover:bg-[#d946ef40] transition duration-200 transform -translate-x-1/2 cursor-ns-resize	z-[2]"
        >
          <div
            className="w-[6px] h-[6px] bg-[#0a0a0a] border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          ></div>
        </div>

        <div
          id="__left_center_selector"
          className="w-[24px] h-[24px]  rounded-full absolute top-1/2 left-[-11px] hover:bg-[#d946ef40] transition duration-200 transform -translate-y-1/2 cursor-ew-resize	z-[2]"
        >
          <div
            className="w-[6px] h-[6px] bg-[#0a0a0a] border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          ></div>
        </div>

        <div
          id="__right_center_selector"
          className="w-[24px] h-[24px]  rounded-full absolute top-1/2 right-[-11px] hover:bg-[#d946ef40] transition duration-200 transform -translate-y-1/2 cursor-ew-resize	z-[2]"
        >
          <div
            className="w-[6px] h-[6px] bg-[#0a0a0a] border  border-[#AF11C7] rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[3]"
          ></div>
        </div>
      </div>

      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, type Ref, ref, watch } from "vue";
import { useCanvasStore } from "@/stores/canvas";
import Toolbar from "./Toolbar.vue";
import { useVueFlow } from "@vue-flow/core";
import _ from "lodash";

const canvasContainer: Ref<HTMLDivElement | null> = ref(null);
const resizeOverlay: Ref<HTMLDivElement | null> = ref(null);
const canvas: Ref<HTMLCanvasElement | null> = ref(null);
const context: Ref<CanvasRenderingContext2D | null> = ref(null);
const canvasStore = useCanvasStore();
const vueFlow = useVueFlow();

const props = defineProps<{
  mousePosition: {
    x: number;
    y: number;
  };
  position: Object;
  selected: boolean;
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

function setCanvasSize(width: number, height: number) {
  if (canvas.value) {
    setCanvasContainerSize(width, height);
    setResizeOverlaySize(width, height);
    canvas.value.style.width = `${width}px`;
    canvas.value.style.height = `${height}px`;
    canvas.value.width = width * 3;
    canvas.value.height = height * 3;
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

function drawCanvasImage(image: HTMLImageElement) {
  if (context.value) {
    context.value.drawImage(image, 0, 0, image.width, image.height);
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
  _.debounce((newValue) => {
    canvasStore.isNodeSelected = newValue;
  }, 2)
);

onMounted(() => {
  if (canvas.value) {
    context.value = canvas.value.getContext("2d");
    if (context.value) {
      context.value.imageSmoothingEnabled = false;
      context.value.imageSmoothingQuality = "high";
    }

    const defaultImage = new Image();
    defaultImage.src = "https://i.hizliresim.com/8ujm0qp.jpg";

    defaultImage.onload = () => {
      const width = defaultImage.width / 3;
      const height = defaultImage.height / 3;

      setCanvasSize(width, height);
      drawCanvasImage(defaultImage);
    };
  }
});
</script>

<style lang="less" scoped>
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
    z-index: 1;
  }
}
</style>
