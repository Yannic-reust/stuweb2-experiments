import express from "express";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { createServer } from "node:http";

// create a new express web server
let app = express();

// create a new socket.io server
const server = createServer(app);

const gameState = createGameState();
const connectedUsers = {};

function createGameState() {
  return [
    { index: 0, player: null },
    { index: 1, player: null },
    { index: 2, player: null },
    { index: 3, player: null },
    { index: 4, player: null },
    { index: 5, player: null },
    { index: 6, player: null },
    { index: 7, player: null },
    { index: 8, player: null },
  ];
}

function updateGameState(index) {
  gameState[index].player = 1;
  io.emit("game_state", gameState);
  console.log(gameState);
}

// Enable CORS

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

// a client has connected
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  //console.log(socket);
  // Check if user has an existing ID (rejoining)
  if (
    (socket.id = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    ))
  ) {
    const playerId = socket.id;
    console.log(`User ${playerId} reconnected`);
    connectedUsers[playerId] = socket.id;
    socket.emit("user_id_reconnect", { userId: playerId });
  } else {
    // Assign a new ID for a new user
    const playerId = socket.id;
    console.log(`User ${playerId} connected`);
    connectedUsers[playerId] = socket.id;
    // Send the new user their ID
    socket.emit("user_id", { userId: playerId });
  }

  // Handle gameplay logic here...

  // Store the player's ID in case of disconnection
  socket.on("disconnect", () => {
    const playerId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );
    if (playerId) {
      console.log(`User ${playerId} disconnected`);
      // Additional logic for disconnect handling if needed
    }
  });
});

// Additional function to generate a unique user ID
function generateUserId() {
  return Math.random().toString(36).substr(2, 9);
}

// start the web server
let port = process.env.PORT || 8080; // set our port
server.listen(port);
console.log("Magic happens on port " + port);
