<script setup>
import { io } from "socket.io-client";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import socket from '../socketService.js';

const gameState = ref([]);

const store = useStore();



function sendInput(index) {
  console.log("sending input");
  socket.emit("input", {move:index, userID: store.state.userID});
}

onMounted(() => {

  socket.on("game_state", (data) => {
    gameState.value = data;

  });
  console.log(store.state.userID);
});

</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <div class="h-min">
      <div class="bg-lightgrey h-min p-8 rounded-3xl mb-4">
        <h1
          class="font-roboto text-center bg-gradient-to-r from-orange to-pink bg-clip-text text-h-md"
          style="color: transparent"
        >
          Tic Tac Toe
        </h1>
        <!-- <p>{{ player }}</p> -->
      </div>
      <div class="flex">
       
        <div class="grid gap-4 grid-rows-3 grid-cols-3">
          <div
            class="bg-lightgrey h-24 w-24 rounded-3xl"
            v-for="(item, index) in gameState"
            :key="index"
            @click="sendInput(index)"
          >
            <div v-if="item.player == '1'">
              <p class="text-white text-h-md">X</p>
            </div>
            <div v-if="item.player == '0'">
              <p class="text-white text-h-md">X</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
