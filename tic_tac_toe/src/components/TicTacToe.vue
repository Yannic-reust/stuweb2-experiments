<script setup>
import { io } from "socket.io-client";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import socket from "../socketService.js";

const gameState = ref([]);
const yourTurn = ref(true);
const store = useStore();

function sendInput(index) {
  console.log("wanting to sending input");
  if (yourTurn.value) {
    console.log("sending input");
    socket.emit("input", { move: index, userID: store.state.userID, roomID: store.state.roomID, player: store.state.player});
  }
}

onMounted(() => {
  socket.on("game_state", (data) => {
    gameState.value = data;
  });
  socket.on("turn", (data) => {
    console.log(data);
   console.log(store.state.player);
    yourTurn.value = data === store.state.player;
    console.log(yourTurn.value);
    /*if (data == store.state.userID) {
      yourTurn.value = true;
    
    }
    else{
      yourTurn.value = false;
    }*/
  });
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
            <div v-if="item.player == '1'"  class="flex justify-center items-center h-full">
              <img src="../assets/icons/cross.svg" alt="circle" class="w-2/3"/>
            </div>
            <div v-if="item.player == '2'" class="flex justify-center items-center h-full">
              <img src="../assets/icons/circle.svg" alt="circle" class="w-2/3"/>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
