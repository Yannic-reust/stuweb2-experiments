<script setup>
import { useStore } from "vuex";
import { onMounted, onBeforeMount, ref } from "vue";
import socket from "../socketService.js";

import { useRoute, useRouter } from "vue-router";

import WinnerModal from "../components/WinnerModal.vue";
import LoserModal from "../components/LoserModal.vue";
import NotYourTurn from "../components/NotYourTurn.vue";

const winner = ref(false);
const loser = ref(false);
const notYourTurn = ref(false);

const gameState = ref([]);
const yourTurn = ref(true);

const store = useStore();
const route = useRoute();
const router = useRouter();

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
  else{
    notYourTurn.value = true;
    setTimeout(() => {
      notYourTurn.value = false;
    }, 3000);
  }
}

onBeforeMount(() => {
  const parts = route.fullPath.split("/");
  const url = parts[parts.length - 1];

  socket.emit("join_room", url);

  if (store.state.player == null) {
    socket.on("connected", (data) => {
      store.dispatch("updateUser", data.userID);
      store.dispatch("updateRoom", data.roomID);
      store.dispatch("updatePlayer", data.player);
      store.dispatch("updateWaiting", false);

      router.push(`/${data.roomID}`);
    });
  }
});

onMounted(() => {
  socket.on("game_state", (data) => {
    gameState.value = data;
  });
  socket.on("game_over", (data) => {
    if (data.winner === store.state.player) {
      winner.value = true;
    } else {
      loser.value = true;
    }
  });
  socket.on("turn", (data) => {
    yourTurn.value = data === store.state.player;
  });
});
</script>

<template>
  <div class="w-full h-full flex justify-center items-center relative">
    <WinnerModal :open="winner" @close="winner = false" />
    <LoserModal :open="loser" @close="loser = false" />

    <div class="h-min">
      <div class="bg-lightgrey h-min p-8 rounded-3xl">
        <h1
          class="font-roboto text-center bg-gradient-to-r from-orange to-pink bg-clip-text text-h-md"
          style="color: transparent"
        >
          Tic Tac Toe
        </h1>
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
        <div v-else>
          <p>There is no game running</p>
        </div>
      </div>
      <NotYourTurn :open="notYourTurn" />
    </div>
  </div>
</template>
<style></style>
