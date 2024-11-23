<template>
  <div
    ref="toolbarSection"
    class="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-[11] flex items-center justify-center rounded-[4px] px-4"
  >
    <div class="w-[900px] relative">
      <input
        class="p-4 text-[13px] outline-0 w-full rounded-full h-[48px] bg-neutral-100 border focus:bg-neutral-200 hover:bg-neutral-200 transition duration-200 placeholder-[#00000065] text-neutral-600"
        type="text"
        v-model="prompt"
        style="resize: none"
        placeholder="Prompt..."
      />

      <div class="absolute top-1/2 right-2 transform -translate-y-1/2">
        <v-btn
          rounded="xl"
          color="primary"
          :loading="loading"
          @click="generateImageByPrompt"
          :disabled="!prompt"
          >Generate</v-btn
        >
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
  if (prompt) {
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

<style lang="scss"></style>
