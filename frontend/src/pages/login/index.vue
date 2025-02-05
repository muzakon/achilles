<template>
  <div class="container mx-auto flex items-center justify-center flex-col">
    <div class="w-[320px]">
      <div class="pt-[130px] text-left">
        <h1 class="text-[22px] font-semibold">Think it. Make it.</h1>
        <h1 class="text-[20px] font-semibold mt-[8px] text-[#acaba9]">
          Login to Achilles
        </h1>
      </div>

      <div class="pt-[32px]">
        <v-btn variant="outlined" width="100%" class="__socialButton">
          <div class="flex items-center">
            <img
              src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
              width="20"
            />
          <span> Continue with Google </span>
          </div>
        </v-btn>
      </div>
    </div>
    <!-- <div class="w-[420px] mt-[200px] border rounded p-5">
      <div>
        <v-text-field
          clearable
          label="Email"
          variant="outlined"
          hide-details="auto"
          v-model:model-value="form.email"
        ></v-text-field>
      </div>

      <div class="mt-3">
        <v-text-field
          clearable
          v-model:model-value="form.password"
          label="Password"
          variant="outlined"
          hide-details="auto"
          type="password"
        ></v-text-field>
      </div>

      <div class="mt-3">
        <v-btn
          color="primary"
          elevation="0"
          class="w-full"
          @click="authenticateUser"
          :loading="isButtonLoading"
          :disabled="isButtonLoading"
        >
          Login
        </v-btn>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import type { Login } from "@/interfaces/Auth";
import { AuthService } from "@/services/Auth";

const authService = new AuthService();
const isButtonLoading = ref(false);

const form: Ref<Login> = ref({
  email: "",
  password: "",
});

async function authenticateUser() {
  await authService.login(form.value, isButtonLoading);
}
</script>

<style scoped></style>
