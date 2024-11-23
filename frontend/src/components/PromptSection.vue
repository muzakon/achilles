<template>
  <div
    ref="toolbarSection"
    class="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-[11] flex items-center justify-center rounded-[4px] px-4"
  >
    <div class="w-[900px] relative">
      <input
        class="p-4 text-[13px] outline-0 w-full rounded-full focus:border-purple-500/50 border border-white/10 focus:ring focus:ring-purple-500/10 placeholder-white/40 bg-[#202020] h-[48px]"
        type="text"
        v-model="prompt"
        style="resize: none"
        placeholder="Prompt..."
      />

      <div class="absolute top-1/2 right-2 transform -translate-y-1/2">
        <v-btn rounded="xl" color="primary" block>Rounded xs</v-btn>
        <!-- <button
          class="btn-grad py-2 px-4 rounded-full text-[12px] flex items-center justify-center h-[32px] min-w-[120px]"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"
              />
            </svg>
          </span>
          <span class="ml-2"> Generate </span>
        </button> -->
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
}

.btn-grad:hover {
  background-position: right center; /* change the direction of the change here */
  color: #fff;
}
</style>
