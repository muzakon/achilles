<template>
  <div>
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos voluptates
    odit architecto quibusdam reprehenderit cum doloribus, sunt aliquid iste
    maiores laborum non odio ipsam illum possimus accusamus quam? Ipsa,
    blanditiis.

    {{ userImages }}
  </div>
</template>

<script setup lang="ts">
import { ImageApi } from "@/services/api/image.api";
const useImageApi = new ImageApi();
const userImages: Ref<unknown[]> = ref([]);

async function fetchUserImages() {
  userImages.value = await useImageApi.fetchAllUserImages();
}

onMounted(async () => {
  await fetchUserImages();
});
</script>

<style scoped></style>
