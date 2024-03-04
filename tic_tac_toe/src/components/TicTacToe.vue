<script setup>
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import socket from "../socketService.js";
import { useRoute } from "vue-router";
import ToolTip from "./ToolTip.vue";


import QrcodeVue from "qrcode.vue";

const gameState = ref([]);
const yourTurn = ref(true);
const qrcode = ref(false);
const store = useStore();
const route = useRoute();
const link = route.fullPath.slice(1);

const value = ref("localhost:5173/" + link);

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
      <div class="bg-lightgrey h-min p-8 rounded-3xl mb-4">
        <h1
          class="font-roboto text-center bg-gradient-to-r from-orange to-pink bg-clip-text text-h-md"
          style="color: transparent"
        >
          Tic Tac Toe
        </h1>
      </div>
      <div class="flex">
        <div class="grid gap-4 grid-rows-3 grid-cols-3">
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
      <div v-if="store.state.waiting && gameState">
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
          <p class="text-white px-4 py-4 text-h-xs font-roboto">Wating...</p>
        </div>
        <div class="rounded-3xl bg-lightgrey mt-8">
          <div class="w-full p-4">
            <p
              class="text-white text-p-sm font-roboto font-bold text-center mb-2"
            >
              Room ID
            </p>
            <div class="flex cursor-pointer justify-center">
              
                <p class="text-white text-p-xs font-roboto">{{ link }}</p>
             
                <ToolTip />
            
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
      </div>
    </div>
  </div>
</template>
<style>
.tippy-tooltip.tomato-theme {
  background-color: tomato;
  color: yellow;
}
</style>
