<script setup>
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import socket from "../socketService.js";
import ShareGame from "./ShareGame.vue";
import { useRoute } from "vue-router";

const gameState = ref(["", "", "", "", "", "", "", "", ""]);
const yourTurn = ref(true);

const store = useStore();
const route = useRoute();
const link = route.fullPath.slice(1);

function sendInput(index) {
  console.log("wanting to sending input");
  if (
    yourTurn.value &&
    gameState.value[index].player === null &&
    !store.state.waiting
  ) {
    console.log("sending input");
    socket.emit("input", {
      move: index,
      userID: store.state.userID,
      roomID: store.state.roomID,
      player: store.state.player,
    });
  }
}

onMounted(() => {
  socket.on("game_state", (data) => {
    gameState.value = data;
  });

  /*socket.on("room_full", () => {
    alreadyFull.value = true;
  });*/

  socket.on("turn", (data) => {
    yourTurn.value = data === store.state.player;
  });
});
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <div class="h-min">
      <div class="bg-lightgrey h-min p-8 rounded-3xl">
        <h1
          class="font-roboto text-center bg-gradient-to-r from-orange to-pink bg-clip-text text-h-md"
          style="color: transparent"
        >
          Tic Tac Toe
        </h1>
      </div>
      <div v-if="store.state.waiting && gameState" class="">
        <ShareGame :link="link" />
      </div>
      <div class="flex">
        <div
          class="grid gap-4 grid-rows-3 mt-4 grid-cols-3"
          v-if="!store.state.waiting"
        >
          <div
            class="bg-lightgrey h-24 w-24 rounded-3xl cursor-pointer"
            v-for="(item, index) in gameState"
            :key="index"
            @click="sendInput(index)"
          >
            <div
              v-if="item.player == '1'"
              class="flex justify-center items-center h-full select-none"
            >
              <img src="../assets/icons/cross.svg" alt="circle" class="w-2/3" />
            </div>
            <div
              v-if="item.player == '2'"
              class="flex justify-center items-center h-full select-none"
            >
              <img
                src="../assets/icons/circle.svg"
                alt="circle"
                class="w-2/3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
