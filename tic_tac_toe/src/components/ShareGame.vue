<script setup>
import ToolTip from "./ToolTip.vue";
import QrcodeVue from "qrcode.vue";
import { defineProps,ref } from "vue";


const props = defineProps({link: String})




const qrcode = ref(false);
const value = ref("https://tictactoey.vercel.app/join/" + props.link);

</script>

<template>
  <div>
    <div class="rounded-3xl bg-lightgrey mt-8">
      <div class="w-full p-4">
        <p class="text-white text-p-sm font-roboto font-bold text-center mb-2">
          Room ID
        </p>
        <div class="flex cursor-pointer justify-center">
          <p class="text-white text-p-xs font-roboto">{{ link }}</p>
          <div v-if="link">
            <ToolTip :link="link" />
          </div>
        </div>
      </div>
      <div class="w-full p-4">
        <div
          class="flex cursor-pointer justify-center"
          @click="qrcode = !qrcode"
        >
          <p
            class="text-white text-p-sm font-roboto font-bold text-center mb-2"
          >
            QR-Code
          </p>
          <img
            src="../assets/icons/arrow-down.svg"
            alt="copy"
            class="h-6 ml-2"
            :class="{ 'origin-center rotate-180': qrcode }"
          />
        </div>
        <Transition>
          <div class="flex justify-center" v-if="qrcode">
            <qrcode-vue :value="value" level="M" :size="200" />
          </div>
        </Transition>
      </div>
    </div>
    <div class="rounded-3xl bg-lightgrey mt-8 flex items-center">
      <svg
        class="animate-spin h-5 w-5 ml-6 fill-white text-white"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="fill-darkgrey"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="fill-white"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p class="text-white px-4 py-4 text-h-xs font-roboto">Waiting...</p>
    </div>
  </div>
</template>
<style>
.tippy-tooltip.tomato-theme {
  background-color: tomato;
  color: yellow;
}
</style>
