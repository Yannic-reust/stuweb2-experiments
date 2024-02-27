<template>
    <div>
      <p>{{ message }}</p>
      <input v-model="inputMessage" type="text"/>
      <button @click="sendMessage">Send Message</button>
    </div>
  </template>
  
  <script>
  import { io } from 'socket.io-client';
  
  export default {
    data() {
      return {
        message: '',
        inputMessage: '',
      };
    },
    mounted() {
      const socket = io('http://localhost:8080');
  
      socket.on('msg', (msg) => {
        this.message = msg;
      });
  
      socket.on('client_msg', (msg) => {
        console.log('Received message from server:', msg);
        // Handle the received message as needed
      });
    },
    methods: {
      sendMessage() {
        const socket = io('http://localhost:8080');
        socket.emit('client_msg', this.inputMessage);
        // Handle the message sending logic as needed
      },
    },
  };
  </script>