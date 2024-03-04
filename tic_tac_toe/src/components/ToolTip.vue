<template>
  <div class="relative bg-pink flex justify-center items-center" >
    <div class="absolute bottom-8 " :class="[showToolTip ? 'inline-flex' : 'hidden']">
      <p>asd</p>
    </div>
    <div @mouseover="showToolTip = true" @mouseleave="showToolTip = false" @click="copyToClipBoard">
      <img src="../assets/icons/copy.svg" alt="copy" class="h-6 ml-2 mr-2" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showToolTip = ref(false);

function copyToClipBoard() {
    navigator.clipboard.writeText(pixCodeInput.value.value);
}


</script>
