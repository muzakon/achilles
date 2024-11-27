<template>
  <div
    id="maskContainer"
    class="absolute l-0 t-0 bg-no-repeat bg-cover bg-center"
    :style="{
      width: imageWidth + 'px',
      height: imageHeight + 'px',
      backgroundImage: `url('${props.canvasImage}')`,
    }"
  >
    <div></div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasStore } from "@/stores/canvas";
import { onMounted, type Ref, ref } from "vue";

const canvasStore = useCanvasStore();
const imageWidth: Ref<number> = ref(0);
const imageHeight: Ref<number> = ref(0);
const props = defineProps<{
  canvasImage: string | null;
}>();

watch(
  () => props.canvasImage,
  (newValue) => {
    if (newValue) {
      const defaultImage = new Image();
      defaultImage.src = newValue;

      defaultImage.onload = () => {
        imageWidth.value = defaultImage.width;
        imageHeight.value = defaultImage.height;
      };
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
#maskContainer {
  &::after {
    position: absolute;
    left: 0;
    top: 0;
    content: "";
    width: 100%;
    height: 100%;
    // background: linear-gradient(
    //   135deg,
    //   #d946ef 10%,
    //   #0000 0,
    //   #0000 50%,
    //   #d946ef 0,
    //   #d946ef 60%,
    //   #0000 0,
    //   #0000
    // );
    // background-size: 7.07px 7.07px;
    // background-color: #79bbf91a;

    background: radial-gradient(circle at 2px 2px, #85ff66 1px, #00000000 1px) 0 /
      5px 5px;
  }
}
</style>
