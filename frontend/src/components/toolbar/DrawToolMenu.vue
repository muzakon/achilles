<template>
  <div>
    <div>
      <h1 class="mb-4 font-semibold text-[14px] text-neutral-700">Draw</h1>

      <div
        class="rounded-full h-[28px] w-[28px] inline-flex justify-center items-center cursor-pointer hover:bg-neutral-200 mr-0.5 mb-0.5 transition duration-200"
        v-for="(color, index) in colors"
        :key="index"
        :class="{
          'bg-neutral-200': brushStore.brushOptions.color === color,
        }"
        @click="selectColor(color)"
      >
        <span
          class="min-h-[12px] min-w-[12px] rounded-full inline-block border border-neutral-100"
          :style="{
            background: color,
          }"
        ></span>
      </div>

      <div class="mt-2">
        <v-slider
          density="comfortable"
          v-model="brushStore.brushOptions.size"
          :max="256"
          :min="8"
          :step="8"
          thumb-size="18"
          hide-details
        ></v-slider>
      </div>

      <div class="flex items-center gap-2 mt-6">
        <div>
          <v-text-field
            v-model:model-value="brushStore.brushOptions.size"
            label="Size"
            variant="outlined"
            type="number"
            suffix="px"
            density="compact"
            hide-details
          >
          </v-text-field>
        </div>
        <div>
          <DrawToolColorPicker @close-color-picker="handleOnCloseColorPicker" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { commonColors } from "@/helper/Constants";
import { useBrushOptionsStore } from "@/stores/brush";

const brushStore = useBrushOptionsStore();
const { setBrushOptions } = brushStore;
const colors: Ref<string[]> = ref([]);

onMounted(() => {
  colors.value = commonColors;
});

function selectColor(color: string) {
  setBrushOptions({ ...brushStore.getBrushOptions, color: color });
}

function handleOnCloseColorPicker() {
  if (!colors.value.includes(brushStore.brushOptions.color)) {
    if (colors.value.length >= 21) {
      colors.value.pop();
    }
    colors.value.push(brushStore.brushOptions.color);
  }
}
</script>

<style scoped></style>
