<template>
  <div>
    <v-form v-model="isFormValid" class="mt-2">
      <div>
        <v-text-field
          v-model:model-value="form.email"
          clearable
          label="Email"
          color="primary"
          variant="outlined"
          hide-details="auto"
          density="compact"
          :rules="FormRuleService.emailRules"
        />
      </div>

      <div class="mt-3">
        <v-text-field
          v-model:model-value="form.password"
          clearable
          color="primary"
          label="Password"
          variant="outlined"
          hide-details="auto"
          type="password"
          density="compact"
          :rules="FormRuleService.passwordRules"
        />
      </div>

      <div class="mt-3 text-[11px] text-gray-500">
        Use an organization email to easily collaborate with teammates.
      </div>

      <div class="mt-5">
        <v-btn
          class="w-full"
          color="primary"
          elevation="0"
          :loading="isButtonLoading"
          :disabled="isButtonLoading"
          @click="authenticateUser"
        >
          Continue
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import type { Login } from "@/interfaces/Auth";
import { AuthApi } from "@/services/api/auth.api";
import { FormRuleService } from "@/services/helper/FormRuleHelperService";
import dayjs from "dayjs";
import { push } from "notivue";
import { useRouter, type LocationQueryValue } from "vue-router";

const router = useRouter();
const authApi = new AuthApi();
const isButtonLoading = ref(false);
const isFormValid = ref(false);

const form: Ref<Login> = ref({
  email: "hasan@muzak.com",
  password: "12345678",
});

async function authenticateUser() {
  // Attempt to log in the user using the provided form data
  const response = await authApi.login(form.value, isButtonLoading);

  // Check if the login was successful and a response was received
  if (response) {
    // Set the access token cookie with its expiration time
    FormRuleService.setCookie(
      "accessToken",
      response.accessToken,
      response.accessTokenExpiresIn
    );

    // Calculate the expiration time for the refresh token (10 years from now)
    const refreshTokenExpiration: number = dayjs().add(10, "years").unix();

    // Set the refresh token cookie with the calculated expiration time
    FormRuleService.setCookie(
      "refreshToken",
      response.refreshToken,
      refreshTokenExpiration
    );

    // Retrieve the redirect URL from the query parameters, defaulting to "/" if not present
    const redirect: string | LocationQueryValue[] =
      router.currentRoute.value.query.redirect || "/";

    push.success({
      message:
        "You have successfully logged in. You will be redirected shortly...",
      duration: 2000,
    });
    isButtonLoading.value = true;
    setTimeout(() => {
      isButtonLoading.value = false;
      // Redirect the user to the specified URL, ensuring it's a string
      router.push(typeof redirect === "string" ? redirect : "/");
    }, 2000);
  }
}
</script>

<style scoped></style>
