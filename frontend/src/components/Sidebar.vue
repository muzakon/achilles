<template>
  <div
    class="fixed left-5 top-5 w-[320px] bg-[#202020] rounded-[5px] z-[1000] sidebar overflow-y-auto"
  >
    <div class="w-full">
      <Accordion :value="['0', '1', '2']" :multiple="true">
        <AccordionPanel value="0">
          <AccordionHeader style="padding: 24px; background-color: #202020"
            >General Settings</AccordionHeader
          >
          <AccordionContent>
            <div class="px-3">
              <div>
                <div class="mb-1 text-white">Model</div>
                <AutoComplete
                  v-model="selectedModel"
                  :suggestions="models"
                  @complete="search"
                  :style="{ width: '100%' }"
                />
              </div>

              <div class="mt-6">
                <div class="mb-1 text-white">Image Size</div>
                <div class="flex items-center">
                  <div class="w-full">
                    <Slider v-model="overlayWidth" :max="2048" />
                  </div>
                  <div class="ml-4">
                    <InputGroup>
                      <InputGroupAddon>W</InputGroupAddon>
                      <InputNumber v-model="overlayWidth" />
                      <InputGroupAddon>px</InputGroupAddon>
                    </InputGroup>
                  </div>
                </div>

                <div class="flex items-center mt-4">
                  <div class="w-full">
                    <Slider v-model="overlayHeight" :max="2048" />
                  </div>
                  <div class="ml-4">
                    <InputGroup>
                      <InputGroupAddon>H</InputGroupAddon>
                      <InputNumber v-model="overlayHeight" />
                      <InputGroupAddon>px</InputGroupAddon>
                    </InputGroup>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="1">
          <AccordionHeader style="padding: 24px; background-color: #202020"
            >Composition</AccordionHeader
          >
          <AccordionContent>
            <div class="px-3">
              <div class="bg-neutral-900 p-4 mt-0 rounded-[5px]">
                <div class="flex items-center">
                  <span class="material-symbols-outlined text-[24px]">
                    photo_size_select_large
                  </span>
                  <span class="ml-2"> Reference </span>
                </div>

                <div class="p-1">
                  <div class="flex items-center mt-6">
                    <div
                      class="h-[72px] min-w-[72px] border-2 border-dashed rounded-[5px] border-white/30 flex items-center justify-center flex-col text-white/40 hover:bg-neutral-800 cursor-pointer hover:border-green-300/50 hover:text-green-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-photo-up"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15 8h.01" />
                        <path
                          d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"
                        />
                        <path
                          d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5"
                        />
                        <path
                          d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526"
                        />
                        <path d="M19 22v-6" />
                        <path d="M22 19l-3 -3l-3 3" />
                      </svg>
                    </div>

                    <div class="w-full pl-[20px]">
                      <button
                        class="py-1 rounded-full flex items-center justify-center h-[28px] w-full bg-neutral-600 hover:bg-neutral-700"
                      >
                        <span class="material-symbols-outlined text-[18px]">
                          cloud_upload
                        </span>
                        <span class="ml-2 text-[11px]"> Upload Image </span>
                      </button>

                      <button
                        class="py-1 rounded-full text-[12px] flex items-center justify-center h-[28px] w-full mt-3 bg-neutral-600 hover:bg-neutral-700"
                      >
                        <span class="material-symbols-outlined text-[18px]">
                          trackpad_input
                        </span>
                        <span class="ml-2 text-[11px] capitalize">
                          Pick from favorites
                        </span>
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 mt-6">
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] border-2 border-white/80 cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>

        <AccordionPanel value="2">
          <AccordionHeader style="padding: 24px; background-color: #202020"
            >Style</AccordionHeader
          >
          <AccordionContent>
            <div class="px-3">
              <div>
                <div class="mb-4 text-white">Guidance Scale</div>
                <div class="flex items-center">
                  <div class="w-full">
                    <Slider v-model="overlayWidth" :max="10" :min="1" />
                  </div>
                </div>
              </div>

              <div class="mt-5">
                <div class="mb-4 text-white">Strength</div>
                <div class="flex items-center">
                  <div class="w-full">
                    <Slider v-model="overlayWidth" :max="10" :min="1" />
                  </div>
                </div>
              </div>

              <div class="bg-neutral-900 p-4 mt-5 rounded-[5px]">
                <div class="flex items-center">
                  <span class="material-symbols-outlined text-[24px]">
                    photo_size_select_large
                  </span>
                  <span class="ml-2"> Reference </span>
                </div>

                <div class="p-1">
                  <div class="flex items-center mt-6">
                    <div
                      class="h-[72px] min-w-[72px] border-2 border-dashed rounded-[5px] border-white/30 flex items-center justify-center flex-col text-white/40 hover:bg-neutral-800 cursor-pointer hover:border-green-300/50 hover:text-green-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-photo-up"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15 8h.01" />
                        <path
                          d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5"
                        />
                        <path
                          d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3.5 3.5"
                        />
                        <path
                          d="M14 14l1 -1c.679 -.653 1.473 -.829 2.214 -.526"
                        />
                        <path d="M19 22v-6" />
                        <path d="M22 19l-3 -3l-3 3" />
                      </svg>
                    </div>

                    <div class="w-full pl-[20px]">
                      <button
                        class="py-1 rounded-full flex items-center justify-center h-[28px] w-full bg-neutral-600 hover:bg-neutral-700"
                      >
                        <span class="material-symbols-outlined text-[18px]">
                          cloud_upload
                        </span>
                        <span class="ml-2 text-[11px]"> Upload Image </span>
                      </button>

                      <button
                        class="py-1 rounded-full text-[12px] flex items-center justify-center h-[28px] w-full mt-3 bg-neutral-600 hover:bg-neutral-700"
                      >
                        <span class="material-symbols-outlined text-[18px]">
                          trackpad_input
                        </span>
                        <span class="ml-2 text-[11px] capitalize">
                          Pick from favorites
                        </span>
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-2 mt-6">
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] border-2 border-white/80 cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="bg-neutral-900 p-4 mt-5 rounded-[5px]">
                <div class="flex items-center">
                  <span class="material-symbols-outlined text-[24px]">
                    grain
                  </span>
                  <span class="ml-2"> Effects </span>
                </div>

                <div class="p-1">
                  <div class="mt-5 grid grid-cols-3 gap-2">
                    <span
                      class="inline-block text-center px-2 text-[11px] py-1 border border-white/30 rounded-[5px] cursor-pointer hover:bg-neutral-800"
                      >All</span
                    >
                    <span
                      class="inline-block text-center px-2 text-[11px] py-1 border border-white/30 rounded-[5px] cursor-pointer hover:bg-neutral-800"
                      >Themes</span
                    >
                    <span
                      class="inline-block text-center px-2 text-[11px] py-1 border border-white/30 rounded-[5px] cursor-pointer hover:bg-neutral-800"
                      >Concepts</span
                    >
                    <span
                      class="inline-block text-center px-2 text-[11px] py-1 border border-white/30 rounded-[5px] cursor-pointer hover:bg-neutral-800"
                      >Filters</span
                    >
                  </div>
                  <div class="grid grid-cols-3 gap-2 mt-6">
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] border-2 border-white/80 cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                    <div
                      class="bg-[url('https://clio-assets.adobe.com/clio-playground/image-style-zeros/v3/images/Featured/1.jpg')] bg-cover bg-no-repeat bg-center w-[72px] h-[72px] rounded-[5px] cursor-pointer"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>

<script setup lang="ts">
import AutoComplete from "primevue/autocomplete";
import Slider from "primevue/slider";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputNumber from "primevue/inputnumber";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";

import { ref } from "vue";
const models = ref([]);
const selectedModel = ref(null);
const overlayWidth = ref(600);
const overlayHeight = ref(300);

const search = (event) => {
  models.value = [...Array(10).keys()].map((item) => event.query + "-" + item);
};
</script>

<style scoped lang="less">
.sidebar {
  height: calc(100% - 33px);
}
</style>
