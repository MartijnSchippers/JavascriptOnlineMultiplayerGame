// server/server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const randomColor = require('randomcolor');
// const Board = require('./board.js')
const Map = require('./map.js');
const Player = require('./player.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../client')));



// Init a map
const map1 = new Map('map1');
// const player = new Player(400, 200, 15);
// console.log("JSON info map1:", map1.getInfoJSON());
const players = {};




// client-server functions
io.on('connection', (socket) => {
  // const color = randomColor();
  console.log('A user connected');
  
  // Handle disconnection
  socket.on('disconnect', () => {
    delete players[socket.id];
    console.log('User disconnected with ID ', socket.id);
  });

  // make the new player
  players[socket.id] = new Player(400, 200, 15);
  console.log('color new player: ', players[socket.id].color);

  // send the state of the game when the player joins
  socket.emit('initGameState', {'map': map1, 'players': players});

  // send the map to the user
  // socket.emit('map', map1);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
