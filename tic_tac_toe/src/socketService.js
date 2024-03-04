import { io } from "socket.io-client";

const socket = io("https://stuweb2-experiments-backend.onrender.com");

export default socket;
