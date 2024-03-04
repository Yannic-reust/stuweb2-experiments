import { io } from 'socket.io-client';

const socket = io('https://tictactoe.bbmit-service.tech'); // Replace with your server URL

export default socket;