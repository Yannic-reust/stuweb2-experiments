import { io } from "socket.io-client";

const socket = io("https://tictactoe.bbmit-service.tech", {
  secure: true, 
  reconnect: true, 
  rejectUnauthorized: false, 
}); 

export default socket;
