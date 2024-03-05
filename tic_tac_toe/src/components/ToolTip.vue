<template>
  <div class="relative flex justify-center items-center" >
    <div class="absolute bottom-8 bg-pink shadow-md rounded-lg break-keep" :class="[showToolTip ? 'inline-flex' : 'hidden']">
      <p class="break-keep w-32 text-center font-roboto text-white p-2 ">{{text}}</p>

    </div>
    <div @mouseover="showToolTip = true" @mouseleave="showToolTip = false" @click="copyToClipBoard">
      <img src="../assets/icons/copy.svg" alt="copy" class="h-6 ml-2 mr-2" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const showToolTip = ref(false);
const text = ref("click to copy");


const props = defineProps({link: String})


function copyToClipBoard() {

  text.value = "copied!";
    navigator.clipboard.writeText(props.link);
}


</script>
