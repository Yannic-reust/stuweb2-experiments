<script setup>
import { io } from "socket.io-client";
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter } from "vue-router";
import socket from '../socketService.js';

const router = useRouter();



const store = useStore();
const name = ref("");



function createRoom() {
  console.log("Creating room");
 

  socket.emit("create_room", name.value);

  socket.on("connected", (data) => {

    store.dispatch("updateUser", data.userID);
    router.push(`/${data.roomID}`);

    console.log(data);
  });
}
function joinRoom() {
  socket = io("http://localhost:8080");
  socket.emit("join_room", "id to join");

  socket.on("connected", (data) => {
    console.log("joined" + data);
  });
}
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
        <div class="mt-2 flex w-1/2 pr-2 items-center flex-col">
          <form @submit.prevent="createRoom">
            <input
              type="text"
              v-model="name"
              name="name"
              id="name"
              placeholder="Name"
              required
              className="block w-full h-10 font-roboto rounded-xl border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400  sm:text-sm sm:leading-6"
            />
            <button
              class="bg-lightgrey/80 hover:bg-lightgrey font-roboto text-white font-bold py-2 px-4 w-full mt-2 rounded-xl"
              type="submit"
            >
              Create Room
            </button>
          </form>
        </div>
        <div class="mt-2 flex w-1/2 pl-2 items-center flex-col">
          <input
            type="text"
            name="room-id"
            id="first-name"
            placeholder="Enter Room ID"
            className="block w-full h-10 font-roboto rounded-xl border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400  sm:text-sm sm:leading-6"
          />
          <button
            class="bg-lightgrey/80 mt-2 w-full hover:bg-lightgrey font-roboto h-10 text-white font-bold py-2 px-8 rounded-xl"
            @click="joinRoom()"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
