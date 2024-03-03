<script setup>
/*import { io } from "socket.io-client";

import { onMounted } from "vue";



let socket = null;

onMounted(() => {
  console.log("mounted");
  socket = io("http://localhost:8080");
  socket.on("game_state", (data) => {
    console.log("gamestate" + data);
  });
});*/



</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style src="./style.css"></style>
