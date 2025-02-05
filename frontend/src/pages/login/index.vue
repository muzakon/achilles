<template>
  <div class="container mx-auto flex items-center justify-center flex-col">
    <div class="w-[320px]">
      <div class="pt-[130px] text-left">
        <h1 class="text-[22px] font-semibold">Think it. Make it.</h1>
        <h1 class="text-[18px] font-semibold mt-[0px] text-[#acaba9]">
          Login to Achilles
        </h1>
      </div>

      <div class="pt-[32px]">
        <social-buttons />
        <v-divider style="margin: 16px 0; border-color: rgba(0, 0, 0, 0.65)" />
        <login-form />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialButtons from "@/components/login/SocialButtons.vue";
import LoginForm from "@/components/login/LoginForm.vue";
</script>

<style scoped lang="scss"></style>
