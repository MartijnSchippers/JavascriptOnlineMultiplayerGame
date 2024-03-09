// server/server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const randomColor = require('randomcolor');
// const Board = require('./board.js')
const Map = require('./map.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../client')));



// Init a map
const map1 = new Map('map1');
// console.log("JSON info map1:", map1.getInfoJSON());



// client-server functions
io.on('connection', (socket) => {
  // const color = randomColor();
  console.log('A user connected');
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // send the map to the user
  socket.emit('map', map1);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
