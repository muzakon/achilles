<template>
  <div>
    <div
      class="border rounded-[5px] border-gray-200 p-2.5 flex items-center cursor-pointer hover:bg-gray-100 mb-2"
      v-for="(button, index) in buttons"
      :key="index"
      @click="onClickSocialButton"
    >
      <img :src="button.icon" width="20" />
      <span
        class="text-[12px] text-gray-700 pl-2 font-semibold w-full text-center select-none"
      >
        {{ button.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { push } from "notivue";

const buttons = ref([
  {
    label: "Continue with Google",
    icon: "https://www.svgrepo.com/show/303108/google-icon-logo.svg",
  },
  {
    label: "Continue with Apple",
    icon: "https://www.svgrepo.com/show/69341/apple-logo.svg",
  },
  {
    label: "Continue with Facebook",
    icon: "https://www.svgrepo.com/show/424915/facebook-logo-meta.svg",
  },
  {
    label: "Login with passkey",
    icon: "https://www.svgrepo.com/show/525393/key-minimalistic-square.svg",
  },
]);

function onClickSocialButton() {
  push.error("Social login does not work. :)");
}
</script>
