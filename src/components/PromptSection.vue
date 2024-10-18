<template>
  <div
    ref="toolbarSection"
    class="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-[11] bg-[#0a0a0a] flex items-center justify-center w-[600px] rounded-[4px]"
  >
    <div class="w-full relative h-[90px]">
      <textarea
        class="p-4 text-[13px] outline-0 w-full rounded-[4px] h-full focus:border-purple-500/50 border border-white/10 focus:ring focus:ring-purple-500/10 placeholder-white/40"
        type="text"
        v-model="prompt"
        style="resize: none"
        placeholder="Prompt..."
      >
      </textarea>

      <div class="absolute right-0 bottom-3 pr-2">
        <button
          class="btn-grad py-2 px-4 rounded-full text-[12px] flex items-center justify-center"
        >
          Generate
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from "vue";
import Button from "primevue/button";
import Tag from "primevue/tag";

const prompt = ref("");
</script>

<style lang="less">
.btn-grad {
  background-image: linear-gradient(
    to right,
    #a855f7 0%,
    #7e22ce 51%,
    #e879f9b4 100%
  );
  text-align: center;
  transition: 0.5s;
  background-size: 200% auto;
  color: white;
  display: block;
}

.btn-grad:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
}
</style>
