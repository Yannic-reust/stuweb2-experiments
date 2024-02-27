<script setup>
import { io } from "socket.io-client";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";

const gameState = ref([]);
const player = ref("");

const store = useStore();

const socket = io("http://localhost:8080",{
    
    auth: { userId: store.state.userId },
});

function sendInput(index) {
  console.log("Sending move:", index);
  socket.emit("send_move", index);
}

onMounted(() => {
  socket.on("user_id", (data) => {
    //safe userID in store
    store.dispatch("updateUser", data.userId);
    player.value = data.userId;
  });

  socket.on("user_id_reconnect", (data) => {
    console.log("reconnected");
    console.log(data);
  });

  socket.on("game_state", (newGameState) => {
    gameState.value = newGameState;
  });
});
</script>

<template>
  <div class="bg-darkgrey">
    <div class="w-full h-screen flex justify-center items-center">
      <div class="h-min">
        <div class="bg-lightgrey h-min p-8 rounded-3xl mb-4 text-white">
          <h1 class="font-roboto text-center text-h-md">Tic Tac Toe</h1>
          <p>{{ player }}</p>
        </div>
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
