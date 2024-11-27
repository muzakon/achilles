<template>
  <div>
    <div>
      <h1 class="mb-4 font-semibold text-[14px] text-neutral-700">Eraser</h1>
      <div>
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

      <div class="mt-6">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { commonColors } from "@/helper/Constants";
import { useBrushOptionsStore } from "@/stores/brush";

const brushStore = useBrushOptionsStore();
const colors: Ref<string[]> = ref([]);

onMounted(() => {
  colors.value = commonColors;
});
</script>

<style scoped></style>
