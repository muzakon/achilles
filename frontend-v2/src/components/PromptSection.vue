<template>
  <div
    ref="toolbarSection"
    class="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-[11] flex items-center justify-center rounded-[4px] px-4"
  >
    <div class="w-[900px] relative">
      <input
        v-model="prompt"
        class="p-4 text-[13px] outline-0 w-full rounded-full h-[48px] bg-white border focus:!border-neutral-700 transition duration-200 placeholder-[#00000065] text-neutral-600 promptInput"
        type="text"
        style="resize: none"
        placeholder="Prompt..."
      />

      <div class="absolute top-1/2 right-2 transform -translate-y-1/2">
        <v-btn
          rounded="xl"
          color="grey-darken-4"
          :loading="loading"
          :disabled="!prompt"
          @click="generateImageByPrompt"
        >
          Generate
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from "vue";
import Api from "@/services/Api";
import { useCanvasStore } from "@/stores/canvas";

const prompt = ref("");
const loading = ref(false);
const canvasStore = useCanvasStore();

// Store Functions
const { setCurrentCanvasImage } = canvasStore;

async function generateImageByPrompt() {
  if (prompt.value) {
    try {
      loading.value = true;
      const data = await Api.generateImageByPrompt(prompt.value);
      setCurrentCanvasImage(data.url);
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.promptInput {
  box-shadow: 0 0 3px 0 rgba(0 0 0 / 12%), 0 3px 8px 0 rgba(0 0 0 / 4%),
    0 4px 16px 0 rgba(0 0 0 / 8%);
}
</style>
