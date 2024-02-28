<script setup>
import { io } from "socket.io-client";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import Connection from "./Connection.vue";

const gameState = ref([]);
const room = ref("");
const connected = ref(false);

const store = useStore();

let socket = null;

function createRoom() {
  socket = io("http://localhost:8080");
  socket.emit("create_room", socket.id);

  socket.on("connected", (data) => {
    connected.value = data.connected;
    room.value = data.roomID;
  });

  /* socket.on("game_state", (newGameState) => {
    gameState.value = newGameState;
  });*/
}
function joinRoom() {
  socket = io("http://localhost:8080");
  socket.emit("join_room", "id to join");

  socket.on("connected", (data) => {
    connected.value = data.connected;
    room.value = data.roomID;
  });

  /* socket.on("game_state", (newGameState) => {
    gameState.value = newGameState;
  });*/
}

function disconnect() {
  socket.disconnect();
  connected.value = false;
}

/*function sendInput(index) {
  console.log("Sending move:", index);
  socket.emit("send_move", index);
}*/
</script>

<template>
  <div class="bg-darkgrey relative">
    <!-- buttons -->
    <div class="absolute top-4 right-4">
      <Connection :connected="connected" />
    </div>
    <button
      class="bg-yellow/80 hover:bg-yellow font-roboto text-yellowText font-bold py-2 px-4 rounded-xl absolute top-4 left-4"
      @click="disconnect"
    >
      Disconnect
    </button>
    <!-- buttons end -->

    <div class="w-full h-screen flex justify-center items-center">
      <div class="h-min">
        <div class="bg-lightgrey h-min p-8 rounded-3xl mb-4 ">
         
          <h1 class="font-roboto text-center bg-gradient-to-r from-orange to-pink bg-clip-text text-h-md" style="color: transparent;">Tic Tac Toe</h1>
          <!-- <p>{{ player }}</p> -->
        </div>
        <div class="w-full mt-4 flex justify-center">
          <input
         
         type="text"
         name="name"
         id="name"
        placeholder="Name"
         className="block w-2/3 h-10 font-roboto rounded-xl border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400  sm:text-sm sm:leading-6"
       />
          <button
            class="bg-lightgrey/80 hover:bg-lightgrey font-roboto text-white font-bold py-2 px-4 w-2/3 rounded-xl"
            @click="createRoom()"
          >
            Create Room 
          </button>
        </div>
        <div class="mt-4 flex items-center flex-col">
          
         
           
        
       
          <input
         
              type="text"
              name="room-id"
              id="first-name"
             placeholder="Enter Room ID"
              className="block w-2/3 h-10 font-roboto rounded-xl border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400  sm:text-sm sm:leading-6"
            />
            <button
            class="bg-lightgrey/80 mt-2 w-2/3 hover:bg-lightgrey font-roboto h-10 text-white font-bold py-2 px-8 rounded-xl"
            @click="joinRoom()"
          >
            Join Room
          </button>
         
        </div>

        <!-- <div class="grid gap-4 grid-rows-3 grid-cols-3">
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
        </div> -->
      </div>
    </div>
  </div>
</template>
