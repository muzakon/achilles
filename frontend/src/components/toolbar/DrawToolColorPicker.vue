<template>
  <v-menu
    v-model="showColorPickerMenu"
    :close-on-content-click="false"
    location="end"
    z-index="9999"
    :offset="[5, 0]"
  >
    <template v-slot:activator="{ props }">
      <div
        v-bind="props"
        class="border rounded-[5px] p-[10px] text-[12px] hover:bg-neutral-100 transition duration-200 cursor-pointer"
      >
        <pre>{{ brushStore.brushOptions.color }}</pre>
      </div>
    </template>

    <v-card width="300">
      <div>
        <v-color-picker mode="hex" @update:model-value="handleOnColorChange" />
      </div>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { useBrushOptionsStore } from "@/stores/brush";

const brushStore = useBrushOptionsStore();
const { setBrushOptions } = brushStore;
const showColorPickerMenu = ref(false);

const emits = defineEmits<{
  (e: "closeColorPicker"): void;
}>();

function handleOnColorChange(color: string) {
  setBrushOptions({ ...brushStore.brushOptions, color });
}

watch(showColorPickerMenu, (newValue: boolean) => {
  if (!newValue) {
    emits("closeColorPicker");
  }
});
</script>

<style scoped></style>
