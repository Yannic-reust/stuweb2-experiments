<script setup>
import Connection from "../components/Connection.vue";

import TicTacToe from '../components/TicTacToe.vue'
import {  ref } from "vue";

const connected = ref(false);

</script>

<template>
  <div class="relative bg-darkgrey w-full h-screen flex justify-center">


    <!-- <div class="absolute top-4 right-4">
      <Connection :connected="connected" />
    </div> -->
    <!-- <button
      class="bg-yellow/80 hover:bg-yellow font-roboto text-yellowText font-bold py-2 px-4 rounded-xl absolute top-4 left-4"
      @click="disconnect"
    >
      Disconnect
    </button> -->
   
      <TicTacToe @connected="connected = true"/>
 
  
   

    
  </div>
</template>


